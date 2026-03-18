import { PrismaClient, UserRole, JobType, WorkplaceType, ExperienceLevel, SalaryPeriod } from "../app/generated/prisma/client";
import { faker } from "@faker-js/faker";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // ---- 1. Create Employers ----
  const employers = await Promise.all(
    Array.from({ length: 3 }).map(() =>
      prisma.user.create({
        data: {
          name: faker.person.fullName(),
          email: faker.internet.email().toLowerCase(),
          role: UserRole.EMPLOYER,
        },
      })
    )
  );

  // ---- 2. Create Companies ----
  const companies = await Promise.all(
    employers.map((employer, index) =>
      prisma.company.create({
        data: {
          name: faker.company.name(),
          slug: faker.helpers.slugify(`company-${index}-${faker.company.name()}`).toLowerCase(),
          description: faker.company.catchPhrase(),
          websiteUrl: faker.internet.url(),
          location: faker.location.city(),
          owners: {
            connect: { id: employer.id },
          },
        },
      })
    )
  );

  // ---- 3. Create Tags ----
  const tagNames = [
    "React",
    "Next.js",
    "TypeScript",
    "Node.js",
    "PostgreSQL",
    "AWS",
    "Docker",
    "GraphQL",
  ];

  const tags = await Promise.all(
    tagNames.map((name) =>
      prisma.tag.create({
        data: {
          name,
          slug: name.toLowerCase().replace(/\s+/g, "-"),
        },
      })
    )
  );

  // ---- 4. Create Jobs ----
  for (const company of companies) {
    for (let i = 0; i < 5; i++) {
      const randomTags = faker.helpers.arrayElements(tags, 3);

      await prisma.job.create({
        data: {
          title: faker.person.jobTitle(),
          slug: faker.helpers.slugify(faker.person.jobTitle()).toLowerCase(),

          description: faker.lorem.paragraphs(3),
          requirements: faker.lorem.paragraphs(2),
          benefits: faker.lorem.paragraphs(2),

          jobType: faker.helpers.arrayElement(Object.values(JobType)),
          workplaceType: faker.helpers.arrayElement(Object.values(WorkplaceType)),
          experienceLevel: faker.helpers.arrayElement(Object.values(ExperienceLevel)),

          location: faker.location.city(),
          isRemote: faker.datatype.boolean(),

          salaryMin: faker.number.int({ min: 30000, max: 60000 }),
          salaryMax: faker.number.int({ min: 60000, max: 120000 }),
          salaryPeriod: SalaryPeriod.YEAR,
          currency: "GBP",

          isPublished: true,
          publishedAt: new Date(),

          companyId: company.id,
          createdById: employers[0].id,

          tags: {
            create: randomTags.map((tag) => ({
              tagId: tag.id,
            })),
          },
        },
      });
    }
  }

  console.log("✅ Seeding complete");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });