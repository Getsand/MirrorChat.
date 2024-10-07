import mongoose from "mongoose"

type ConnectionObject = {
    isConnected?: number

}

const connection: ConnectionObject={}

// muje parvaah nhi h kis tarah ka return value
async function dbConnect(): Promise<void> {
    // in  next js every time make connection but in others makes a connection continue
    // check database is connected or not for database chowking problem 
    if(connection.isConnected){
        console.log("Already connected to database")
        return
    }
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI ||
            '', {})
            connection.isConnected = db.connections[0].readyState
            console.log("DB conneted Successfully")
    } 
    catch (error){  
        console.log("Database connection is failed", error)
        process.exit(1)
    }
}
export default dbConnect;


// assign  db.connections ko console.log
// and db ko console.log