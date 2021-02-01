// console.log("script is linked");
// this file is where all of our Vue code will exist!!

(function () {
    new Vue({
        // el - element in our html that has access to our Vue code!
        el: "#mainBoard",
        // data - an object that we add any info to that is dynamic / we want to render onscreen
        data: {
            name: "Adobo",
            seen: true,
            images: [],
        },

        // mounted is a lifecycle method that runs when the Vue instance renders
        mounted: function () {
            console.log("my vue instance has mounted");
            console.log("this outside axios: ", this);
            var self = this;

            axios
                .get("/home")
                .then(function (res) {
                    console.log("this inside axios: ", self);
                    // axios will ALWAYS store the info coming from the server inside a 'data' property
                    // console.log("response from /cities: ", response.data);

                    self.images = res.data;
                })
                .catch(function (err) {
                    console.log("err in /home: ", err);
                });
        },

        // methods will store ALL the functions we create!!!
        methods: {
            myFunction: function () {
                console.log("myFunction is running!!!!");
            },
        },
    });
})();
