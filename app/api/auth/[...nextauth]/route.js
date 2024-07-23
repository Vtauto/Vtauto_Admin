import NextAuth from "next-auth/next"
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/UserModel";
import bcrypt from "bcryptjs";



export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {},


            async authorize(credentials) {
                const { email, password } = credentials;
                try {
                    await dbConnect();
                    const user = await UserModel.findOne({ email });

                    if (!user) {
                        return null;
                    }

                    const passwordMatch = await bcrypt.compare(password, user.password);

                    if (!passwordMatch) {
                        return null;
                    }

                    return user;

                } catch (error) {
                    console.log("Error:", error)
                }
                return user;
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/user/login", 
    },

    
};


const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };