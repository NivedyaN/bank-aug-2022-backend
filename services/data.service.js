// import model Account
const db = require('./db')
//import jsonWebtoken
const jwt = require('jsonWebtoken')

// login function
const login = (acno, pswd) => {
    // check acno and pswd is present in mongodb   
    // asynchronous function - promise
    return db.Account.findOne({
        acno,
        password: pswd
    }).then((result) => {
        if (result) {
            // acno n pswd is present in db
            console.log('login successfull');

            //currentAacno
            let currentAcno = acno
            //generate token
            const token = jwt.sign({
                currentAcno: acno
            }, 'winwon')

            return {
                status: true,
                message: 'login successfull',
                username: result.username,
                statusCode: 200,
                token,
                currentAcno
            }
        }
        else {
            console.log('Invalid Account / password');
            return {
                status: false,
                message: 'Invalid Account / password',
                statusCode: 404
            }
        }
    })
}

// register function
const register = (acno, pswd, uname) => {
    // check acno  is present in mongodb
    // asynchronous function - promise
    return db.Account.findOne({
        acno,
    }).then((result) => {
        if (result) {
            // acno is present in db
            console.log('already registerd');
            return {
                status: false,
                message: 'Account already exit .. please login',
                statusCode: 404
            }
        }
        else {
            console.log('Register successfull');
            let newAccount = new db.Account({
                acno,
                password: pswd,
                username: uname,
                balance: 0,
                transaction: []
            })
            newAccount.save()
            return {
                status: true,
                message: 'Register successfull',
                statusCode: 200
            }
        }
    })
}

// deposit function
const deposit = (req, acno, pswd, amount) => {
    // convert string amount to number
    let amt = Number(amount)
    // check acno and pswd is present in mongodb
    // asynchronous function - promise
    return db.Account.findOne({
        acno,
        password: pswd
    }).then((result) => {
        if (result) {


            if (req.currentAcno != acno) {
                return {
                    status: false,
                    message: 'Operation denied!.. allows only own account transaction',
                    statusCode: 404
                }

            }

            // acno n pswd is present in db
            result.balance += amt
            result.transaction.push({
                type: "CREDIT",
                amount: amt
            })
            result.save()
            return {
                status: true,
                message: `${amount} credited successfully`,
                statusCode: 200
            }
        }
        else {
            console.log('Invalid Account / password');
            return {
                status: false,
                message: 'Invalid Account / password',
                statusCode: 404
            }
        }
    })
}

// withdraw function
const withdraw = (req, acno, pswd, amount) => {

    // convert string amount to number
    let amt = Number(amount)
    // check acno and pswd is present in mongodb
    // asynchronous function - promise
    return db.Account.findOne({
        acno,
        password: pswd
    }).then((result) => {
        if (result) {


            if (req.currentAcno != acno) {
                return {
                    status: false,
                    message: 'Operation denied!.. allows only own account transaction',
                    statusCode: 404
                }

            }
            // check sufficiant balance
            if(result.balance < amt){
                //insufficiant balance
                return {
                    status: false,
                    message: 'Transaction failed...Insufficiant balance',
                    statusCode: 404
                }

            }
             
            // perform withdraw

            result.balance -= amt
            result.transaction.push({
                type: "DEBIT",
                amount: amt
            })
            result.save()
            return {
                status: true,
                message: `${amount} debitted successfully`,
                statusCode: 200
            }
        }
        else {
            console.log('Invalid Account / password');
            return {
                status: false,
                message: 'Invalid Account / password',
                statusCode: 404
            }
        }
    })
}
//getBalance
const getBalance=(acno)=>{
    //asynchrous function -promise
    return db.Account.findOne({
        acno
    }).then(
        (result)=>{
            if(result){
                //acno present in db
                let balance=result.balance
                result.transaction.push({
                    type:"BALANCE ENQUIRY",
                    amount:'NILL'
                })
                result.save()
                //send to client
                return{
                    status:true,
                    statusCode:200,
                    message:`Your current balance is:${balance}`
                }
            }
            else{
                 //acno not present in db

                 //send to client
                 return{
                     status:false,
                     statusCode:404,
                     message:`Invalid account number`
                       }
                }
            }
        )
            
}

//getTransaction
const getTransaction=(acno)=>{
    //asynchrous function -promise
    return db.Account.findOne({
        acno
    }).then(
        (result)=>{
            if(result){
                //acno present in db
               
                //send to client
                return{
                    status:true,
                    statusCode:200,
                    transaction:result.transaction
                }
            }
            else{
                 //acno not present in db

                 //send to client
                 return{
                     status:false,
                     statusCode:404,
                     message:`Invalid account number`
                       }
                }
            }
        )
 }
 //deleteAccount
 const deleteAccount=(acno)=>{
      //asynchrous function -promise
    return db.Account.deleteOne({
        acno
    }).then(
        (result)=>{
            if(result){
                
                //send to client
                return{
                    status:true,
                    statusCode:200,
                    message:'Account deleted successfully'
                }
            }
            else{
                 //acno not present in db

                 //send to client
                 return{
                    status:false,
                    statusCode:404,
                    message:`Invalid account number`
                      }
            }
             })
 }


// export
module.exports = {
    login,
    register,
    deposit,
    withdraw,
    getBalance,
    getTransaction,
    deleteAccount
}