

import { checkSchema } from "express-validator";



const validateSignup = checkSchema({
     name: {
          isString: true,
          trim: true,
          notEmpty: {
               errorMessage: "Name not Empty"
          },
          isLength: {
               options: {
                    min: 3,
                    max: 50
               },
               errorMessage: "Name must be between 3 and 50 characters"
          },

     },

     email: {
          notEmpty: {
               errorMessage: "Email not Empty"
          },
          // isEmail: {
          //      errorMessage: "Invalid Email"
          // },
          trim: true,

     },

     password: {
          notEmpty: {
               errorMessage: "Password not Empty"
          },
          isString: true,
          trim: true,
          isLength: {
               options: {
                    min: 8,
                    max: 50
               },
               errorMessage: "Password must be between 8 and 50 characters"
          },
          isStrongPassword: {
               options: {

                    minLowercase: 1,
                    minUppercase: 1,
                    minNumbers: 1,
                    minSymbols: 1,
               },
               errorMessage: "Password must at least 1 lowercase, 1 uppercase, 1 number, and 1 symbol"
          },

     },

     date_of_birth: {
          notEmpty: {
               errorMessage: "Date of Birth not Empty"
          },
          isISO8601: true,
          errorMessage: "Invalid Date of Birth"
     }
})

const validateVerifyEmail = checkSchema({
     verification: {
          notEmpty: {
               errorMessage: "Verification token not Empty"
          },
          isString: true,
          trim: true,
     }
})

const validateVerifyOTP = checkSchema({
     otp: {
          notEmpty: {
               errorMessage: "OTP not Empty"
          },
          isLength: {
               options: {
                    min: 6,
                    max: 6
               },
               errorMessage: "OTP must be 6 number"
          },
          trim: true,
     }
})

const validateRequestVerification = checkSchema({
     email: {
          notEmpty: {
               errorMessage: "Email not Empty or Account already verified"
          },
          isString: true,
          trim: true,


     }
})

const validateForgotPassword = checkSchema({
     email: {
          notEmpty: {
               errorMessage: "Email not Empty"
          },
          isString: true,
          trim: true,
          isEmail: {
               errorMessage: "Invalid Email"
          }
     }
})

const validateEditProfile = checkSchema({
     date_of_birth: {
          optional: { options: { nullable: true } }, // Cho phép trống
          isISO8601: {
               errorMessage: "Invalid Date of Birth"
          }
     },
     name: {
          optional: { options: { nullable: true } }, // Cho phép trống
          isString: {
               errorMessage: "Name must string"
          },
          trim: true,
          isLength: {
               options: {
                    min: 3,
               },
               errorMessage: "Name at least 3 characters"
          }
     },
     username: {
          optional: { options: { nullable: true } }, // Cho phép trống
          isString: {
               errorMessage: "Username must string"
          },
          trim: true,
          isLength: {
               options: {
                    min: 3,
                    max: 26
               },
               errorMessage: "Username at least 3 characters"
          }
     },
     bio: {
          optional: { options: { nullable: true } }, // Cho phép trống
          isString: {
               errorMessage: "Bio must string"
          },
          trim: true,
          isLength: {
               options: {
                    max: 160
               },
               errorMessage: "Bio at most 160 characters"
          }
     },
     location: {
          optional: { options: { nullable: true } }, // Cho phép trống
          isString: {
               errorMessage: "Location must string"
          },
          trim: true,
          isLength: {
               options: {
                    max: 50
               },
               errorMessage: "Location at most 50 characters"
          }
     },
     website: {
          optional: { options: { nullable: true } }, // Cho phép trống
          isString: {
               errorMessage: "Website must string"
          },
          trim: true,
          isLength: {
               options: {
                    max: 255
               },
               errorMessage: "Website at most 255 characters"
          }
     }

})

const validateResetPassword = checkSchema({
     password: {
          notEmpty: {
               errorMessage: "Password not Empty"
          },
          isString: true,
          trim: true,
          isLength: {
               options: {
                    min: 8,
                    max: 50
               },
               errorMessage: "Password must be between 8 and 50 characters"
          },
          isStrongPassword: {
               options: {

                    minLowercase: 1,
                    minUppercase: 1,
                    minNumbers: 1,
                    minSymbols: 1,
               },
               errorMessage: "Password must at least 1 lowercase, 1 uppercase, 1 number, and 1 symbol"
          },

     },
     reset: {
          notEmpty: {
               errorMessage: "Reset token not Empty"
          },
          isString: true,
          trim: true,

     }
})

const validateLogin = checkSchema({

     email: {
          notEmpty: {
               errorMessage: "Email not Empty"
          },
          isEmail: {
               errorMessage: "Invalid Email"
          },
          trim: true,

     },
     password: {
          notEmpty: {
               errorMessage: "Password not Empty"
          },
          isString: true,
          trim: true,
          isLength: {
               options: {
                    min: 8,
                    max: 50
               },
               errorMessage: "Password must be between 8 and 50 characters"
          },
          isStrongPassword: {
               options: {

                    minLowercase: 1,
                    minUppercase: 1,
                    minNumbers: 1,
                    minSymbols: 1,
               },
               errorMessage: "Password must at least 1 lowercase, 1 uppercase, 1 number, and 1 symbol"
          },

     },
})

const validateRefreshtoken = checkSchema({
     auth_id: {
          notEmpty: {
               errorMessage: "ID not Empty"
          },
          isNumeric: {
               errorMessage: "User ID must be a number"
          },
          trim: true,
     }
})

const validateChangePassword = checkSchema({
     accessToken: {
          isString: true,
          trim: true,
          isJWT: {
               errorMessage: "Invalid Access Token"
          }
     },
     oldPassword: {
          notEmpty: {
               errorMessage: "Old Password not Empty"
          },
          isString: true,
          trim: true,
          isLength: {
               options: {
                    min: 8,
                    max: 50
               },
               errorMessage: "Password must be between 8 and 50 characters"
          },
          isStrongPassword: {
               options: {

                    minLowercase: 1,
                    minUppercase: 1,
                    minNumbers: 1,
                    minSymbols: 1,
               },
               errorMessage: "Password must at least 1 lowercase, 1 uppercase, 1 number, and 1 symbol"
          },

     },
     newPassword: {
          notEmpty: {
               errorMessage: "New Password not Empty"
          },
          isString: true,
          trim: true,
          isLength: {
               options: {
                    min: 8,
                    max: 50
               },
               errorMessage: "Password must be between 8 and 50 characters"
          },
          isStrongPassword: {
               options: {

                    minLowercase: 1,
                    minUppercase: 1,
                    minNumbers: 1,
                    minSymbols: 1,
               },
               errorMessage: "Password must at least 1 lowercase, 1 uppercase, 1 number, and 1 symbol"
          },

     },
})

const validateChangeEmail = checkSchema({
     email: {
          notEmpty: {
               errorMessage: "Email not Empty"
          },
          isEmail: {
               errorMessage: "Invalid Email"
          },
          trim: true,
     },
     accessToken: {
          isString: true,
          trim: true,
          isJWT: {
               errorMessage: "Invalid Access Token"
          }
     },
})

const validateChange = checkSchema({
     confirm: {
          notEmpty: {
               errorMessage: "Change token not Empty"
          },
          isJWT: {
               errorMessage: "Invalid Change Token"
          },
          isString: true,
          trim: true,

     }
})

const validateGetInformation = checkSchema({
     accessToken: {
          isString: true,
          trim: true,
          isJWT: {
               errorMessage: "Invalid Access Token"
          }
     },
})

const validateDeleteAccount = checkSchema({
     accessToken: {
          isString: true,
          trim: true,
          isJWT: {
               errorMessage: "Invalid Access Token"
          }
     },
     auth_id: {
          notEmpty: {
               errorMessage: "ID not Empty"
          },
          isNumeric: {
               errorMessage: "User ID must be a number"
          },
          trim: true,

     }
})


const validateSuspendAccount = checkSchema({
     accessToken: {
          isString: true,
          trim: true,
          isJWT: {
               errorMessage: "Invalid Access Token"
          }
     },
     auth_id: {
          notEmpty: {
               errorMessage: "ID not Empty"
          },
          isNumeric: {
               errorMessage: "User ID must be a number"
          },
          trim: true,

     }
})

const validateUnsuspendAccount = checkSchema({
     accessToken: {
          isString: true,
          trim: true,
          isJWT: {
               errorMessage: "Invalid Access Token"
          }
     },
     auth_id: {
          notEmpty: {
               errorMessage: "ID not Empty"
          },
          isNumeric: {
               errorMessage: "User ID must be a number"
          },
          trim: true,

     }
})

const validateGetAllUser = checkSchema({
     accessToken: {
          isString: true,
          trim: true,
          isJWT: {
               errorMessage: "Invalid Access Token"
          }
     },
})

const validateLogout = checkSchema({
     accessToken: {
          isString: true,
          trim: true,
          isJWT: {
               errorMessage: "Invalid Access Token"
          }
     },
})

const validateAvatar = checkSchema({
     accessToken: {
          isString: true,
          trim: true,
          isJWT: {
               errorMessage: "Invalid Access Token"
          }
     },

})


const validateGetUser = checkSchema({
     username: {
          notEmpty: {
               errorMessage: "Username not Empty"
          },
          isString: true,
          trim: true,
     }
})

///////////////////////////


const followValidate = checkSchema({
     follow_user: {
          notEmpty: {
               errorMessage: "Follow user not Empty"
          },
          isNumeric: {
               errorMessage: "Follow user must be a number"
          },
          trim: true,
     },
     accessToken: {
          isString: true,
          trim: true,
          isJWT: {
               errorMessage: "Invalid Access Token"
          }
     },
})


const unfollowValidate = checkSchema({
     unfollow_user: {
          notEmpty: {
               errorMessage: "Follow user not Empty"
          },
          isNumeric: {
               errorMessage: "Follow user must be a number"
          },
          trim: true,
     },
     accessToken: {
          isString: true,
          trim: true,
          isJWT: {
               errorMessage: "Invalid Access Token"
          }
     },
})


const validateAllfollow = checkSchema({
     user: {
          notEmpty: {
               errorMessage: "User ID not Empty"
          },
          isNumeric: {
               errorMessage: "User ID must be a number"
          },
          trim: true,
     }
})


///////////////////////////

const validateTweet = checkSchema({
     accessToken: {
          isString: true,
          trim: true,
          isJWT: {
               errorMessage: "Invalid Access Token"
          }
     },

})

const validateDelete = checkSchema({
     accessToken: {
          isString: true,
          trim: true,
          isJWT: {
               errorMessage: "Invalid Access Token"
          }
     },
     tweet_id: {
          notEmpty: {
               errorMessage: "Tweet ID not Empty"
          },
          trim: true,
     }

})

const validateEditORetweet = checkSchema({
     accessToken: {
          isString: true,
          trim: true,
          isJWT: {
               errorMessage: "Invalid Access Token"
          }
     },
     tweet: {
          notEmpty: {
               errorMessage: "Tweet ID not Empty"
          },
          isNumeric: {
               errorMessage: "Tweet ID must be a number"
          },
          trim: true,
     }

})

const validateTweet_Comment = checkSchema({
     accessToken: {
          isString: true,
          trim: true,
          isJWT: {
               errorMessage: "Invalid Access Token"
          }
     },
     tweet: {
          notEmpty: {
               errorMessage: "Tweet ID not Empty"
          },
          trim: true,
     },
     content: {
          notEmpty: {
               errorMessage: "Tweet ID not Empty"
          },
          isString: true,
          trim: true,
     }

})

const validate_GetDel = checkSchema({
     accessToken: {
          isString: true,
          trim: true,
          isJWT: {
               errorMessage: "Invalid Access Token"
          }
     },
     comment: {
          notEmpty: {
               errorMessage: "Comment ID not Empty"
          },
          isNumeric: {
               errorMessage: "Comment ID must be a number"
          },
          trim: true,
     }

})

const validate_EditComment = checkSchema({
     accessToken: {
          isString: true,
          trim: true,
          isJWT: {
               errorMessage: "Invalid Access Token"
          }
     },
     comment: {
          notEmpty: {
               errorMessage: "Comment ID not Empty"
          },
          isNumeric: {
               errorMessage: "Comment ID must be a number"
          },
          trim: true,
     },
     content: {
          notEmpty: {
               errorMessage: "Comment ID not Empty"
          },
          isString: true,
          trim: true,
     }
})

const valiedate_AllComment = checkSchema({
     tweet: {
          notEmpty: {
               errorMessage: "Tweet ID not Empty"
          },
          isNumeric: {
               errorMessage: "Tweet ID must be a number"
          },
          trim: true,
     }
})

const validate_Tweet = checkSchema({
     tweet: {
          notEmpty: {
               errorMessage: "Tweet ID not Empty"
          },
          isNumeric: {
               errorMessage: "Tweet ID must be a number"
          },
          trim: true,
     }
})


const validate_nav = checkSchema({
     page: {
          notEmpty: {
               errorMessage: "Page not Empty"
          },
          isNumeric: {
               errorMessage: "Page must be a number"
          },
          trim: true,
     }
})

const validate_findcontent = checkSchema({
     content: {
          notEmpty: {
               errorMessage: "Content not Empty"
          },
          isString: true,
          trim: true,
     }
})

const validate_Search = checkSchema({
     search: {
          notEmpty: {
               errorMessage: "Search not Empty"
          },
          isString: true,
          trim: true,
     }
})

const validate_User = checkSchema({
     auth_id: {
          notEmpty: {
               errorMessage: "ID not Empty"
          },
          isNumeric: {
               errorMessage: "User ID must be a number"
          },
          trim: true,
     }
})
export {
     validateSignup,
     validateVerifyEmail,
     validateVerifyOTP,
     validateRequestVerification,
     validateForgotPassword,
     validateResetPassword,
     validateLogin,
     validateRefreshtoken,
     validateChangePassword,
     validateChangeEmail,
     validateChange,
     validateGetInformation,
     validateDeleteAccount,
     validateSuspendAccount,
     validateUnsuspendAccount,
     validateGetAllUser,
     validateLogout,
     validateAvatar,
     validateGetUser,
     followValidate,
     unfollowValidate,
     validateAllfollow,
     validateTweet,
     validateDelete,
     validateEditORetweet,
     validateTweet_Comment,
     validate_GetDel,
     validate_EditComment,
     valiedate_AllComment,
     validate_Tweet,
     validate_nav,
     validate_findcontent,
     validateEditProfile,
     validate_Search,
     validate_User,

}