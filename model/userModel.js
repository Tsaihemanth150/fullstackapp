import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
    userID: {
        type: String,
        unique: true,
        default: function() {
            const randomID = Math.floor(1000 + Math.random() * 9000); // Generate a random 4-digit number
            return `DevOpsAPP${randomID}`;
        }
    },
    username: {
        type: String,
        required: [true, "Please enter the Username"],
        unique: true
    },
    Firstname: {
        type: String,
        required: [true, "Please enter the First Name"],
    },
    Lastname: {
        type: String,
        required: [true, "Please enter the Last Name"],
    },
    email: {
        type: String,
        required: [true, "Please enter the Email"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Please enter the password"],
    }

});

const User = mongoose.models.Users || mongoose.model("Users", userSchema);
export default User;