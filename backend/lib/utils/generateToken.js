import jwt from 'jsonwebtoken';

const generateTokenAndSetCookie = (userId, res) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: "15d",
    })

    res.cookie("jwt", token, {
        maxAge: 15*24*60*60*1000, // 15 days in MS
        httpOnly: true, // ensures the cookie is only accessible via HTTP(S) requests and not through client-side JavaScript, enhancing security.
        sameSite: "strict", //  to prevent the cookie from being sent along with cross-site requests, mitigating CSRF attacks.
        secure: process.env.NODE_ENV !== "development",
    })
}

export { generateTokenAndSetCookie };

