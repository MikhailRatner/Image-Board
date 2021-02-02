// console.log("script is linked");
// this file is where all of our Vue code will exist!!

(function () {
    Vue.component("popup-card", {
        data: function () {
            return {
                //HERE IS THE DATA WHICH WE GIVE TO COMPONENT
                data: [],
            };
        },
        template: `#popup-card-template`,
        props: ["id"],
        /*         methods {
            this.$emit('close')
        } */
        mounted: function () {
            var self = this;
            axios
                .get(`/popup/${this.id}`)
                .then((res) => {
                    console.log("this inside axios: ", this);
                    self.data = res.data[0];
                    console.log("self.images:", data.image);
                })
                .catch(function (err) {
                    console.log("err in /home: ", err);
                });
        },

        methods: {
            closeModal: function () {
                console.log("closing modal: ", this);
                this.$emit("close", this.count);
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
            selectedImage: null,
        },

        // mounted is a lifecycle method that runs when the Vue instance renders
        mounted: function () {
            console.log("my vue instance has mounted");
            console.log("this outside axios: ", this);

            axios
                .get("/home")
                .then((res) => {
                    console.log("this inside axios: ", this);
                    // axios will ALWAYS store the info coming from the server inside a 'data' property
                    // console.log("response from /cities: ", response.data);

                    this.images = res.data;
                    console.log("RES:", res);
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
            /*             clickHandlerImages: function (idParam) {
                //THIS FUNCTION CAN BE EEXCHANGED BY WRITING THIS WITHIN THE IMAGE CLICK HANDLER IN HTML:
                // @click="selectedImage=image.id
                // THIS DIRECTLY CHANGES THE selcetedImage property of data to the id of the looped item (each.id)
                this.selectedImage = idParam;
                console.log("SELECTED IMAGE:", this.selectedImage);
            }, */
        },
    });
})();
