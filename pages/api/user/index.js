// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
    if (req.method === 'POST') {
        // res.status(200).json({ user:{name:"abc",gmail:"abc@gmail.com"},error:"Account is not active . Please check your mail." })

        console.log(req);
        let data={}
        if (req.body.id === "12321lkda") {

             data = {
                id: "12321lkda",
                email: "Hello honey",
                name: "Hello mail",
                dateCreate: "2/1/2021",
                StudentID: "18120210",
                classList: [{ name: "Lập trình java" }, { name: "Web Nâng Cao" }, { name: "Design Pattern" }],
            }
        }else{
             data = {
                id: "12321llmhda",
                email: "damm",
                name: "atula123",
                dateCreate: "2/3/2021",
                StudentID: "18120211",
                classList: [{ name: "Lập trình java123" }, { name: "Web Nâng Cao123" }, { name: "Design Pattern" }],
            }
        }

        res.status(200).json({ data });

    }
    if (req.method === 'GET') {
        // res.status(200).json({ user:{name:"abc",gmail:"abc@gmail.com"},error:"Account is not active . Please check your mail." })
        let data = [{
            id: "12321lkda",
            email: "Hello honey",
            name: "Hello mail",
            dateCreate: "2/1/2021",
            StudentID: "18120210",
        }, {
            id: "12321llmhda",
            email: "damm",
            name: "atula123",
            dateCreate: "2/3/2021",
            StudentID: "18120211",
        }]
        res.status(200).json({ data });
    }
}
