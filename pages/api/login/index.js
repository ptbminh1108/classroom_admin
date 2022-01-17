// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
    if (req.method === 'POST') {
        // res.status(200).json({ user:{name:"abc",gmail:"abc@gmail.com"},error:"Account is not active . Please check your mail." })
        res.status(200).json({ user:{name:"abc",gmail:"abc@gmail.com"},success:true })

      } else {
        // Handle any other HTTP method
        res.status(200).json({ user:{name:"abc",gmail:"abc@gmail.com"},accesstoken:"fadsfews" })
      }
  }
  