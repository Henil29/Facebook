document.addEventListener("DOMContentLoaded", () => {
    const editBioButton = document.querySelector(".bio + .btn");
    const modal = document.getElementById("editBioModal");
    const overlay = document.getElementById("overlay");

    const profileInput = document.getElementById("profileInput");
    const profileText = document.querySelector(".profile-picture");

    const nameInput = document.getElementById("nameInput");
    const nameText = document.querySelector(".user-name");

    const coverInput = document.getElementById("coverInput");
    const coverText = document.querySelector(".cover-photo img");

    const bioInput = document.getElementById("bioInput");
    const bioText = document.querySelector(".bio");

    const confirmBio = document.getElementById("confirmBio");
    const cancelBio = document.getElementById("cancelBio");


    // Get the username dynamically
    let userName = document.querySelector(".user-name")?.innerText.trim();
    let userid = document.querySelector(".user-id")?.innerText.trim();

    editBioButton.addEventListener("click", () => {
        profileInput.value = profileText.src;
        nameInput.value = nameText.innerText;
        coverInput.value = coverText.src;
        bioInput.value = bioText.innerText;
        modal.style.display = "block";
        overlay.style.display = "block";
        document.body.classList.add("modal-open");
    });

    confirmBio.addEventListener("click", () => {
        const newBio = bioInput.value;
        const newProfilePic = profileInput.value;
        const newCoverPhoto = coverInput.value;
        const newName = nameInput.value.trim(); // Updated name

        if (!newBio) {

            alert("Please enter a bio");
        }
        else if (!newProfilePic) {
            alert("Please enter a profile picture");
        }
        else if (!newCoverPhoto) {
            alert("Please enter a cover photo");
        }
        else if (!newName) {
            alert("Please enter a name");
        }
        else {
            bioText.innerText = newBio;
            profileText.src = newProfilePic;
            coverText.src = newCoverPhoto;
            nameText.innerText = newName;

            updateProfile(newName, newBio, newProfilePic, newCoverPhoto); // Send update request to server
            userName = newName; // Update userName globally
            closeModal();
           setTimeout(() => {
            location.reload();
        }
        , 1000);
        }


    });

    cancelBio.addEventListener("click", () => {
        closeModal();
    });

    function closeModal() {
        modal.style.display = "none";
        overlay.style.display = "none";
        document.body.classList.remove("modal-open");
    }

    function updateProfile(newUserName, newBio, newProfilePic, newCoverPhoto) {
        if (!userid) {
            console.error("Username not found!");
            return;
        }

        fetch("/updateProfile", { // Updated API endpoint for better clarity
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ newUserName, newBio, newProfilePic, newCoverPhoto })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    console.log(`Updated profile for ${userid} (New Username: ${newUserName})`);
                } else {
                    console.error("Error:", data.error);
                }
            })
            .catch(error => console.error("Request failed:", error));
    }
});


document.addEventListener("DOMContentLoaded", () => {
    // Elements
    const editDetailsButton = document.getElementById("editDetailsButton");
    const editIntroModal = document.getElementById("editIntroModal");
    const overlay = document.getElementById("overlay");

    // Input fields
    const degreeInput = document.getElementById("degreeInput");
    const universityInput = document.getElementById("universityInput");
    const schoolInput = document.getElementById("schoolInput");
    const relationshipInput = document.getElementById("relationshipInput");

    // Text fields
    const degreeText = document.getElementById("degreeText");
    const universityText = document.getElementById("university");
    const schoolText = document.getElementById("school");
    const relationshipText = document.getElementById("relationship");

    // Buttons
    const confirmDetails = document.getElementById("confirmDetails");
    const cancelDetails = document.getElementById("cancelDetails");

    // Open Modal
    editDetailsButton.addEventListener("click", () => {
        // Prefill inputs
        degreeInput.value = degreeText.innerText;
        universityInput.value = universityText.innerText;
        schoolInput.value = schoolText.innerText;
        relationshipInput.value = relationshipText.innerText;

        // Show modal
        editIntroModal.style.display = "block";
        overlay.style.display = "block";
        document.body.classList.add("modal-open");
    });

    // // Confirm Edits
    confirmDetails.addEventListener("click", () => {
        const newdegreeText = degreeInput.value;
        const newuniversityText = universityInput.value;
        const newschoolText = schoolInput.value;
        const newrelationshipText = relationshipInput.value;

        if (!newdegreeText) {
            alert("Please enter a degree");
        }
        else if (!newuniversityText) {
            alert("Please enter a university");
        }
        else if (!newschoolText) {
            alert("Please enter a school");
        }
        else if (!newrelationshipText) {
            alert("Please enter a relationship");
        }
        else {
            degreeText.innerText = newdegreeText;
            universityText.innerText = newuniversityText;
            schoolText.innerText = newschoolText;
            relationshipText.innerText = newrelationshipText;

            updateDetails(newdegreeText, newuniversityText, newschoolText, newrelationshipText)
            closeModal();
        }

    });

    // // Close Modal Function
    function closeModal() {
        editIntroModal.style.display = "none";
        overlay.style.display = "none";
        document.body.classList.remove("modal-open");
    }

    // // Close modal on Cancel button click
    cancelDetails.addEventListener("click", closeModal);

    // // Close modal when clicking outside (overlay)
    overlay.addEventListener("click", closeModal);

    function updateDetails(degreeText, universityText, schoolText, relationshipText) {
        fetch("/updateDetails", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                newdegreeText: degreeText,
                newuniversityText: universityText,
                newschoolText: schoolText,
                newrelationshipText: relationshipText
            })
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (data.success) {
                   setTimeout(() => {
            location.reload();
        }
        , 1000);  // Refresh the page after updating
                }
            })
            .catch(error => console.error(error));
    }
});


document.addEventListener("DOMContentLoaded", () => {
    let postToDelete = null;
    let postIdToDelete = null;

    // Elements
    const deleteModal = document.getElementById("deleteModal");
    const confirmDeleteBtn = document.getElementById("confirmDelete");
    const cancelDeleteBtn = document.getElementById("cancelDelete");
    const overlay = document.getElementById("overlay");

    // Event listener for delete button click
    document.addEventListener("click", function (e) {
        const deleteButton = e.target.closest(".post-delete");

        if (deleteButton) {
            const postElement = deleteButton.closest(".post");
            const postIdElement = postElement.querySelector(".post-id");
            const postId = postIdElement ? postIdElement.innerText.trim() : null;

            if (!postId) {
                console.error("Post ID not found!");
                return;
            }

            postToDelete = postElement;
            postIdToDelete = postId;

            // Show delete confirmation modal
            deleteModal.style.display = "block";
            overlay.style.display = "block"; // Show overlay
            document.body.classList.add("modal-open");
        }
    });

    // Confirm delete
    confirmDeleteBtn.addEventListener("click", () => {
        if (postIdToDelete && postToDelete) {
            fetch("/deletePost", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ postId: postIdToDelete }),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.success) {
                        postToDelete.remove();
                    } else {
                        alert("❌ Error deleting post!");
                    }
                })
                .catch((error) => console.error("Error:", error));
        }

        // Close modal
        closeModal();
       setTimeout(() => {
            location.reload();
        }
        , 1000);
    });

    // Cancel delete
    cancelDeleteBtn.addEventListener("click", closeModal);

    // Close modal function
    function closeModal() {
        deleteModal.style.display = "none";
        overlay.style.display = "none";
        document.body.classList.remove("modal-open");
    }

});


document.getElementById("openPopup").addEventListener("click", function () {
    document.getElementById("popupModal").style.display = "flex";
    document.body.classList.add("modal-open");
});

document.getElementById("closePopup").addEventListener("click", function () {
    document.getElementById("popupModal").style.display = "none";
    document.body.classList.remove("modal-open");
});

document.getElementById("cancelBtn").addEventListener("click", function () {
    document.getElementById("popupModal").style.display = "none";

});

document.getElementById("confirmBtn").addEventListener("click", function () {
    let imageUrl = document.getElementById("imageUrl").value.trim(); // Trim to avoid accidental spaces

    if (imageUrl) {

        fetch("/addPost", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ postUrl: imageUrl }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    console.log("Post added successfully!"); // Notify user
                } else {
                    console.log("Failed to add post. Please try again.");
                }
            })
            .catch((error) => {
                console.error("Error:", error);
                console.log("Something went wrong!");
            });

        // Hide popup after submission
        let popup = document.getElementById("popupModal");
        if (popup) popup.style.display = "none";
        
        setTimeout(() => {
            location.reload();
        }
        , 1000);
        
    } else {
        alert("Please enter an image URL!");
    }
});

document.addEventListener("DOMContentLoaded", () => {
    let postToEdit = null;
    let postIdToEdit = null;

    // Elements
    const editPostModal = document.getElementById("editPostModal");
    const confirmEditPostBtn = document.getElementById("confirmEditPost");
    const cancelEditPostBtn = document.getElementById("cancelEditPost");
    const overlay = document.getElementById("overlay");

    // Event listener for edit button click
    document.addEventListener("click", function (e) {
        const editButton = e.target.closest(".post-edit");

        if (editButton) {
            const postElement = editButton.closest(".post");
            const postIdElement = postElement.querySelector(".post-id");
            const postId = postIdElement ? postIdElement.innerText.trim() : null;

            if (!postId) {
                console.error("Post ID not found!");
                return;
            }

            postToEdit = postElement;
            postIdToEdit = postId;

            // Prefill the modal with existing data
            const postImage = postElement.querySelector(".post-image")?.src || "";
            const postDate = postElement.querySelector(".post-user-info p span")?.innerText || "";
            document.getElementById("editImageUrl").value = postImage;
            document.getElementById("editPostDate").defaultValue = postDate;

            // Show edit post modal
            editPostModal.style.display = "block";
            overlay.style.display = "block";
            document.body.classList.add("modal-open");
        }
    });

    // Confirm edit
    confirmEditPostBtn.addEventListener("click", () => {
        const newImageUrl = document.getElementById("editImageUrl").value.trim();
        const newPostDate = document.getElementById("editPostDate").value;

        console.log(newImageUrl);
        console.log(newPostDate);
        if (!newImageUrl || !newPostDate) {
            alert("Please fill in all fields!");
            return;
        }

        if (postIdToEdit && postToEdit) {
            fetch("/editPost", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    postId: postIdToEdit,
                    newImageUrl: newImageUrl,
                    newPostDate: newPostDate,
                })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        console.log(data)
                        // Update the post
                        const postImageElement = postToEdit.querySelector(".post-image");
                        const postDateElement = postToEdit.querySelector(".post-user-info p span");

                        if (postImageElement) {
                            postImageElement.src = newImageUrl;
                        }
                        if (postDateElement) {
                            postDateElement.innerText = `${newPostDate}`;
                        }

                        // alert("Post updated successfully!");
                    } else {
                        alert("❌ Error updating post!");
                    }
                })
                .catch((error) => console.error("Error:", error));
        }

        // Close modal
        closeEditModal();
       setTimeout(() => {
            location.reload();
        }
        , 1000);
    });

    // Cancel edit
    cancelEditPostBtn.addEventListener("click", closeEditModal);

    // Close modal function
    function closeEditModal() {
        editPostModal.style.display = "none";
        overlay.style.display = "none";
        document.body.classList.remove("modal-open");
    }
});