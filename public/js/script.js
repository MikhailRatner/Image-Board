// console.log("script is linked");
// this file is where all of our Vue code will exist!!

(function () {
    Vue.component("comment-section", {
        template: `#comment-template`,
        props: ["idC"],

        data: function () {
            return {
                //HERE IS THE DATA WHICH WE GIVE TO COMPONENT
                comments: [],
                username: "",
                comment: "",
            };
        },

        mounted: function () {
            //console.log("vue comment component has mounted!");
            //console.log("this outside get comments axios: ", this);
            console.log("IDC MOUNTED:", this.idC);
            var self = this;
            axios.get(`/comments/${this.idC}`).then((res) => {
                //MAKES A SERVER HTTP REQUEST TO retrieve the all comments made about that particular image.
                console.log("this inside get comments axios: ", self);
                self.comments = res.data;
                console.log("self.comments:", self.comments);
            });
        },

        watch: {
            id: function () {
                var self = this;
                axios
                    .get(`/popup/${this.id}`)
                    .then((res) => {
                        self.data = res.data[0];
                    })
                    .catch(function (err) {
                        console.log("err in /home: ", err);
                    });
            },
        },

        methods: {
            //CLICK HANDLER FOR SUBMIT COMMENTS BUTTON
            submitcomment: function () {
                console.log("ADD COMMI RUNS");
                console.log("idC", this.idC);
                var obj = {
                    comment: this.comment,
                    username: this.username,
                    created_at: this.created_at,
                    idC: this.idC,
                };
                //MAKES A SERVER HTTP REQUEST TO add comment
                axios.post(`/comment`, obj).then((res) => {
                    this.comments.push(res.data).catch(function (err) {
                        console.log("err in /comment post: ", err);
                    });
                });
            },
        },
    });

    Vue.component("popup-card", {
        template: `#popup-card-template`,
        props: ["id"],

        data: function () {
            return {
                //HERE IS THE DATA WHICH WE GIVE TO COMPONENT
                data: [],
                likes: 0,
            };
        },

        mounted: function () {
            var self = this;
            axios
                .get(`/popup/${this.id}`)
                .then((res) => {
                    //console.log("self inside axios: ", self);
                    self.data = res.data[0];
                    //console.log("self.data:", self.data);
                })
                .catch(function (err) {
                    console.log("err in /home: ", err);
                });
        },

        watch: {
            id: function () {
                var self = this;
                axios
                    .get(`/popup/${this.id}`)
                    .then((res) => {
                        if (res.data.length == 0) {
                            self.$emit("close");
                        } else {
                            self.data = res.data[0];
                        }
                        //console.log("self inside axios: ", self);
                        //console.log("self.data:", self.data);
                    })
                    .catch(function (err) {
                        console.log("err in /home: ", err);
                    });
            },
        },

        methods: {
            closePopup: function () {
                this.$emit("close");
            },
            addLike: function () {
                this.likes++;
                let obj = this.likes;
                console.log("One more like, yay");

                /* axios.post(`/like/${this.id}`).then((res) => {
                    console.log(res.data).catch(function (err) {
                        console.log("err in /comment post: ", err);
                    });
                }) */
            },
        },
    });

    new Vue({
        // el - element in our html that has access to our Vue code!
        el: "#main",
        // data - an object that we add any info to that is dynamic / we want to render onscreen
        data: {
            images: [],
            title: "",
            description: "",
            username: "",
            file: null,
            selectedImage: location.hash.slice(1),
            smallestId: 0,
            moreImgButton: true,
        },

        // mounted is a lifecycle method that runs when the Vue instance renders
        mounted: function () {
            addEventListener("hashchange", () => {
                this.selectedImage = location.hash.slice(1);
            });
            axios
                .get("/firstload")
                .then((res) => {
                    //console.log("this inside axios: ", this);
                    // axios will ALWAYS store the info coming from the server inside a 'data' property
                    // console.log("response from /cities: ", response.data);
                    /*WE CAN USE this. BECAUSE IT IS AN ARROW FUNCTION. OTHERWISE WE WOULD HAVE TO DECLASE SELF = THIS BEFORE AXIOS AND THEN USE SELF. INSTEAD OF THIS.*/
                    this.images = res.data;
                    //console.log("RES:", res);
                    this.smallestId = this.images[this.images.length - 1].id;
                })
                .catch(function (err) {
                    console.log("err in /home: ", err);
                });
        },

        // methods will store ALL the functions we create!!!
        methods: {
            clickHandler: function () {
                const fd = new FormData();
                fd.append("title", this.title);
                fd.append("description", this.description);
                fd.append("username", this.username);
                fd.append("file", this.file);
                var self = this;
                axios //response = req.body from server app.post upload
                    .post("/upload", fd)
                    .then((response) => {
                        console.log("response: ", response);
                        self.images.push(response.data);
                    })
                    .catch((err) => console.log("err: ", err));
            },
            //THIS STARTS WHEN SELECTING FILE
            fileSelectHandler: function (e) {
                this.file = e.target.files[0];
            },
            closeModal: function () {
                console.log("CLOSING IN VUE");
                console.log("CLOSING HASH BEFORE:", location.hash);
                location.hash = "";
                console.log("CLOSING HASH AFTER:", location.hash);
                this.selectedImage = null;
            },
            getMorePics: function () {
                //console.log("GET MORE PICS CLICKED:");
                /* var last = this.images.slice(-1)[0]; WORKS BUT OTHER ONE PERFORMANCE IS BETTER*/
                this.smallestId = this.images[this.images.length - 1].id;
                console.log("FIRST ITEM IN IMAGES:", this.smallestId);
                axios
                    .get(`/morepics/${this.smallestId}`)
                    .then((res) => {
                        let moreImg = res.data;
                        for (let i = 0; i < moreImg.length; i++) {
                            if (moreImg[i].id === moreImg[i].smallestId) {
                                this.moreImgButton = false;
                            }
                        }
                        console.log("MORE IMAGES:", moreImg);
                        this.images.push(...moreImg);
                        console.log("THIS IMAGES:", this.images);
                    })
                    .catch((err) => console.log("err in /morepics: ", err));
            },
            /*clickHandlerImages: function (idParam) {
                //THIS FUNCTION CAN BE EEXCHANGED BY WRITING THIS WITHIN THE IMAGE CLICK HANDLER IN HTML:
                // @click="selectedImage=image.id
                // THIS DIRECTLY CHANGES THE selcetedImage property of data to the id of the looped item (each.id)
                this.selectedImage = idParam;
                console.log("SELECTED IMAGE:", this.selectedImage);
            }, */
        },
    });
})();
