import NextAuth from 'next-auth'
// import GithubProvider from 'next-auth/providers/github'
// import GoogleProvider from 'next-auth/providers/google'
// import CredentialsProvider from 'next-auth/providers/credentials'
// import User from '/src//models/User'
// import connect from '/src//utils/db'
// import bcrypt from 'bcryptjs'

const handler = NextAuth({
  providers: [
    // CredentialsProvider({
    //   id: 'credentials',
    //   name: 'Credentials',
    //   async authorize(credentials) {
    //     //Check if the user exists.
    //     await connect()
    //     try {
    //       const user = await User.findOne({
    //         email: credentials.email
    //       })
    //       if (user) {
    //         // const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)
    //         const isPasswordCorrect = true
    //         if (isPasswordCorrect) {
    //           return user
    //         } else {
    //           throw new Error('Wrong Credentials!')
    //         }
    //       } else {
    //         throw new Error('User not found!')
    //       }
    //     } catch (err) {
    //       throw new Error(err)
    //     }
    //   }
    // }),
    // GithubProvider({
    //   clientId: process.env.GITHUB_ID,
    //   clientSecret: process.env.GITHUB_SECRET,
    // }),
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    // }),
  ],
  pages: {
    error: '/',
  },
})

export { handler as GET, handler as POST }
