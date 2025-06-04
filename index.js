const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const port = 8080;

// Middleware
app.use(express.json()); // Parses incoming JSON requests
app.use(express.static(path.join(__dirname, "public", "css")));
app.use(express.static(path.join(__dirname, "public", "js")));
app.use(express.static(path.join(__dirname, "public", "images")));

// Set EJS as the template engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Function to fetch the actual image URL (handles redirects)
// Function to fetch the actual image URL (handles redirects)
async function fetchActualImageUrl(imageUrl) {
    try {
        const fetch = (await import("node-fetch")).default;

        // If the imageUrl is a relative path, return it as-is (skip fetching)
        if (!imageUrl.startsWith("http")) {
            return imageUrl;
        }

        const response = await fetch(imageUrl, { method: "HEAD" });
        return response.url;
    } catch (error) {
        console.error("Error fetching actual image URL:", error);
        return imageUrl; // Return the original URL if an error occurs
    }
}


// Home Route
app.get("/", (req, res) => {
    res.render("home.ejs");
});
let username=""
// Facebook Profile Route
app.get("/facebook/:username", async (req, res) => {
    const facebookData = require("./data.json");
    username = req.params.username.toLowerCase();

    let user = {};

    if (facebookData[username]) {
        user = facebookData[username];

        // Fetch actual profile picture and cover photo URLs
        user.profilePicture = await fetchActualImageUrl(user.profilePicture);
        user.coverPhoto = await fetchActualImageUrl(user.coverPhoto);

        res.render("facebook.ejs", { user ,username});
    } else {
        // Generate new user with random posts
        const posts = [];
        let  user_bio ="Enter your bio here";        
        const education = "Enter your details here";
        const relationship = "Enter your Relationship here";
        const details=[
            {
                "text": "Enter your details here",
            },
            {
                "text": "Enter your details here",
            }
        ]
        // Generate profile and cover photo
        
        const profilePic = "/user-image.png";
        const coverPhoto = "/cover-image.png";
        
        user = {
            name: username,
            username: username,
            profilePicture: profilePic,
            coverPhoto: coverPhoto,
            bio: user_bio,
            education: education,
            details: details,
            relationship: relationship,
            posts: posts
            
        };

        // Save new user data to data.json
        fs.readFile("data.json", "utf8", (err, data) => {
            if (err) {
                console.error("Error reading the file", err);
                return;
            }

            let jsonData = JSON.parse(data);
            jsonData[username] = {
                name: username,
                profilePicture: user.profilePicture,
                coverPhoto: user.coverPhoto,
                bio: user_bio,
                education: education,
                details: user.details,
                relationship: relationship,
                posts: user.posts
            };

            fs.writeFile("data.json", JSON.stringify(jsonData, null, 2), (err) => {
                if (err) {
                    console.error("Error writing to the file", err);
                } else {
                    console.log("New user added successfully!");
                }
            });
        });

        res.render("facebook.ejs", { username, user });
    }
});

app.post("/updateProfile", (req, res) => {
    const {newUserName, newBio, newProfilePic, newCoverPhoto } = req.body;
    const database = require("./data.json");
    if (!username || !newUserName) {
        return res.status(400).json({ success: false, error: "Invalid username" });
    }

    // Check if the user exists
    if (!database[username]) {
        return res.status(404).json({ success: false, error: "User not found" });
    }

    
    // If username remains the same, just update bio, profile picture, and cover photo
    database[username].bio = newBio.toLowerCase();
    database[username].profilePicture = newProfilePic;
    database[username].coverPhoto = newCoverPhoto;
    database[username].name = newUserName;
    
    fs.writeFileSync("data.json", JSON.stringify(database, null, 2));
    res.json({ success: true, message: "Profile updated successfully" });
});

app.post("/updateDetails", (req, res) => {
    const { newdegreeText, newuniversityText, newschoolText, newrelationshipText } = req.body;
    const database = require("./data.json");

    if (!database[username]) {
        return res.status(400).json({ success: false, message: "User not found" });
    }

    database[username].education = newdegreeText;
    database[username].details[0].text = newuniversityText;
    database[username].details[1].text = newschoolText;
    database[username].relationship = newrelationshipText;

    fs.writeFileSync("data.json", JSON.stringify(database, null, 2));
    res.json({ success: true, message: "Profile updated successfully" });
});

app.post("/deletePost", (req, res) => {
    const { postId } = req.body;
    const database = require("./data.json");

    if (!database[username]) {
        return res.status(404).json({ success: false, message: "User not found" });
    }

    // Remove the post with the given ID
    database[username].posts = database[username].posts.filter(
        (post) => post.id.toString() !== postId
    );

    // Update JSON file
    fs.writeFileSync("data.json", JSON.stringify(database, null, 2));

    res.json({ success: true, message: "Post deleted successfully" });
});

app.post("/addPost", (req, res) => {
    const { postUrl } = req.body;
    
    // Read fresh data to avoid caching issues
    let rawData = fs.readFileSync("data.json", "utf8");
    let database = JSON.parse(rawData);

    if (!username || !database[username]) {
        return res.status(404).json({ success: false, message: "User not found" });
    }

    // Determine new post ID
    const lastPost = database[username].posts.length > 0 ? database[username].posts[database[username].posts.length - 1] : null;
    const postIdNum = lastPost ? lastPost.id + 1 : 1;

    // Create new post
    const newPost = {
        id: postIdNum,
        text: `This is post ${postIdNum}`,
        image: postUrl,
        likes: Math.floor(Math.random() * 100),
        comments: Math.floor(Math.random() * 100),
        shares: Math.floor(Math.random() * 100),
        post_date: new Date().toISOString().split('T')[0]
    };

    // Add post to user's posts array (append at the end)
    database[username].posts.push(newPost);

    // Save updated data to file
    fs.writeFileSync("data.json", JSON.stringify(database, null, 2));

    res.json({ success: true, message: "Post added successfully", post: newPost });
});

app.post("/editPost", (req, res) => {
    const { postId, newImageUrl, newPostDate } = req.body;
    const database = require("./data.json"); // Read data.json
    
    if (!database[username] || !database[username].posts) {
        return res.status(404).json({ success: false, error: "User not found" });
    }

    // Convert postId to a number
    const postIdNum = Number(postId);

    // Find the post index
    const postIndex = database[username].posts.findIndex((post) => post.id === postIdNum);

    if (postIndex !== -1) {
        // Update post data
        database[username].posts[postIndex].image = newImageUrl;
        database[username].posts[postIndex].post_date = newPostDate;

        // Write back to data.json
        fs.writeFileSync("data.json", JSON.stringify(database, null, 2));

        res.json({ success: true });
    } else {
        res.status(404).json({ success: false, error: "Post not found" });
    }
});


// Start Server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});


