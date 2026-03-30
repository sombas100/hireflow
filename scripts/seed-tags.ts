import "dotenv/config";
import {
  PrismaClient,
  UserRole,
  JobType,
  WorkplaceType,
  ExperienceLevel,
  SalaryPeriod,
} from "../app/generated/prisma/client";
import { faker } from "@faker-js/faker";
import { PrismaPg } from "@prisma/adapter-pg";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  }),
});

async function main() {
  console.log("🌱 Seeding database...");

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

  const companies = await Promise.all(
    employers.map((employer, index) => {
      const companyName = faker.company.name();
      return prisma.company.create({
        data: {
          name: companyName,
          slug: faker.helpers
            .slugify(`company-${index}-${companyName}`)
            .toLowerCase(),
          description: faker.company.catchPhrase(),
          websiteUrl: faker.internet.url(),
          location: faker.location.city(),
          owners: {
            connect: { id: employer.id },
          },
        },
      });
    })
  );

  const tagNames = [
    "JavaScript",
    "TypeScript",
    "Python",
    "Java",
    "C#",
    "PHP",
    "Go",
    "Rust",
    "Ruby",
    "Kotlin",
    "Swift",
    "C++",
    "React",
    "Next.js",
    "Vue",
    "Angular",
    "Node.js",
    "Express",
    "Django",
    "Laravel",
    "Spring Boot",
    ".NET",
    "PostgreSQL",
    "MySQL",
    "MongoDB",
    "Redis",
    "Docker",
    "Kubernetes",
    "AWS",
    "Azure",
    "GCP",
    "GraphQL",
    "REST API",
    "Tailwind CSS",
    "HTML",
    "CSS",
    "Git",
    "GitHub",
    "CI/CD",
    "Linux",
    "Terraform",
    "Firebase",
    "Prisma",
    "Sequelize",
  ];

  const tags = await Promise.all(
    tagNames.map((name) =>
      prisma.tag.upsert({
        where: { slug: name.toLowerCase().replace(/\s+/g, "-") },
        update: {},
        create: {
          name,
          slug: name.toLowerCase().replace(/\s+/g, "-"),
        },
      })
    )
  );

  for (const [companyIndex, company] of companies.entries()) {
    for (let i = 0; i < 5; i++) {
      const randomTags = faker.helpers.arrayElements(tags, 3);
      const jobTitle = faker.person.jobTitle();

      await prisma.job.create({
        data: {
          title: jobTitle,
          slug: faker.helpers
            .slugify(`${jobTitle}-${companyIndex}-${i}-${Date.now()}`)
            .toLowerCase(),

          description: faker.lorem.paragraphs(3),
          requirements: faker.lorem.paragraphs(2),
          benefits: faker.lorem.paragraphs(2),

          jobType: faker.helpers.arrayElement(Object.values(JobType)),
          workplaceType: faker.helpers.arrayElement(Object.values(WorkplaceType)),
          experienceLevel: faker.helpers.arrayElement(
            Object.values(ExperienceLevel)
          ),

          location: faker.location.city(),
          isRemote: faker.datatype.boolean(),

          salaryMin: faker.number.int({ min: 30000, max: 60000 }),
          salaryMax: faker.number.int({ min: 60000, max: 120000 }),
          salaryPeriod: SalaryPeriod.YEAR,
          currency: "GBP",

          isPublished: true,
          publishedAt: new Date(),

          companyId: company.id,
          createdById: employers[companyIndex].id,

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
    console.error("❌ Seed failed:");
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });