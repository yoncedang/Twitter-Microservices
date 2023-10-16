


interface EDIT_TWEET {
     tweet_id: string,
     auth_id: number,
     content: string,
     URL: any[],
}

interface CREATE_TWEET {
     message: string,
     status: number,
     auth_id: number,
     content: string,
     URL: any[],
}

interface DELETE_TWEET {
     topic: string,
     auth_id: number,
     tweet_id: number,

}

interface CHECK_TWEET {
     tweet: string,
     auth_id: string
}

interface RE_TWEET {
     tweet_id: string,
     content: string,
     auth_id: number,
     topic: string
}

interface UN_RETWEET {
     tweet_id: string,
     auth_id: number,
     topic: string
}

export {
     EDIT_TWEET,
     CREATE_TWEET,
     DELETE_TWEET,
     CHECK_TWEET,
     RE_TWEET,
     UN_RETWEET,


}
