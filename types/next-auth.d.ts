import "next-auth"
import "next-auth/jwt"

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            role?: "EMPLOYER" | "CANDIDATE" | "ADMIN",
        } & DefaultSession["user"]
    }
    interface User {
        role?: "EMPLOYER" | "CANDIDATE" | "ADMIN",
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        role?: "EMPLOYER" | "CANDIDATE" | "ADMIN",
    }
}