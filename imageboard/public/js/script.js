(function () {
    Vue.component("my-modal-component", {
        template: "#modal",
        props: ["imageId"],
        data: function () {
            return {
                image: {},
                comments: [],
            };
        },
        watch: {
            imageId: function () {
                this.repeatedFunction();
            },
        },
        mounted: function () {
            console.log("modal mounted");
            this.repeatedFunction();
        },
        methods: {
            repeatedFunction: function () {
                var self = this;
                axios
                    .get(`/image/${self.imageId}`)
                    .then(function (response) {
                        console.log("Successfully got image ", response);
                        self.image = response.data[0];
                        return axios.get(`/comments/${self.imageId}`);
                    })
                    .then(function (response) {
                        console.log("Successfully got comments: ", response);
                        self.comments = response.data;
                        console.log("comments: ", self.comments);
                    })
                    .catch(function (error) {
                        self.$emit("close");
                        console.log(
                            "Error getting images or comments: ",
                            error
                        );
                    });
            },
            addComment: function (comment) {
                console.log("emitted comment event: ", comment);
                this.comments.unshift(comment);
            },
            requestCloseModal: function () {
                this.$emit("close");
                location.hash = "";
            },
        },
    });
    //new
    Vue.component("my-add-comment", {
        template: "#add-comment",
        props: ["image"],
        data: function () {
            return {
                comment: "",
                username: "",
            };
        },
        methods: {
            postComment: function () {
                var self = this;
                console.log("image id: ", self.image.id);
                axios
                    .post("/comment", {
                        comment: self.comment,
                        username: self.username,
                        imageId: self.image.id,
                    })
                    .then(function (response) {
                        console.log(
                            "Comment posted successfully: ",
                            response.data
                        );
                        self.$emit("comment", response.data);
                    })
                    .catch(function (error) {
                        console.log("Error posting comment: ", error);
                    });
            },
        },
    });

    Vue.component("my-comments", {
        template: "#comments",
        props: ["comments"],
    });

    //new

    new Vue({
        el: "#main",
        data: {
            images: [],
            title: "",
            description: "",
            username: "",
            file: null,
            showMoreButton: true,
            selectedImageId: location.hash.slice(1),
        },
        mounted: function () {
            var self = this;
            window.addEventListener("hashchange", function () {
                console.log("hash changed");
                self.selectedImageId = location.hash.slice(1);
            });
            axios
                .get("/images")
                .then(function (response) {
                    self.images = response.data;
                })
                .catch(function (error) {
                    console.log("Error in fetching images:", error);
                });
        },
        methods: {
            handleClick: function () {
                var formData = new FormData();
                formData.append("title", this.title);
                formData.append("description", this.description);
                formData.append("username", this.username);
                formData.append("file", this.file);
                var self = this;
                axios
                    .post("/upload", formData)
                    .then(function (response) {
                        console.log("Response from POST /upload: ", response);
                        if (!self.images.length % 9 === 0) {
                            self.images.pop(self.images[length - 1]);
                            self.showMoreButton = true;
                        }
                        self.images.unshift(response.data.newImage);
                        self.title = "";
                        self.description = "";
                        self.username = "";
                        self.file = null;
                    })
                    .catch(function (error) {
                        console.log("Error in POST /upload: ", error);
                    });
            },
            handleChange: function (e) {
                console.log("handle change is running");
                this.file = e.target.files[0];
            },
            getImage: function (e) {
                this.selectedImageId = e.target.id;
                console.log("getImage works", e.target.id);
            },
            prevImage: function (id) {
                if (id != null) {
                    this.selectedImageId = id;
                }
            },
            nextImage: function (id) {
                if (id != null) {
                    this.selectedImageId = id;
                }
            },
            closeModal: function () {
                this.selectedImageId = null;
                history.replaceState(null, null, " ");
            },
            getMoreImages: function () {
                var self = this;
                var lowestId = this.images[this.images.length - 1].id;
                axios
                    .get(`/images/${lowestId}`)
                    .then(function (response) {
                        console.log(
                            "Successfully got more images, ",
                            response.data
                        );
                        self.images = self.images.concat(response.data);
                        for (var i = 0; i < response.data.length; i++) {
                            if (
                                self.images[self.images.length - 1].id ==
                                response.data[i].lowestId
                            ) {
                                self.showMoreButton = false;
                            }
                        }
                    })
                    .catch(function (error) {
                        console.log("Error getting more images: ", error);
                    });
            },
        },
    });
})();
