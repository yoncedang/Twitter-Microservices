interface Signup {
     email: string;
     password: string | Buffer;
     name: string;
     date_of_birth: any;
}

interface JWT_type {
     access: string;
     refresh: string;
     secret: string;
}

interface DEL_user {
     accessToken: string;
     auth_id: number
}

export {
     Signup,
     JWT_type,
     DEL_user
}