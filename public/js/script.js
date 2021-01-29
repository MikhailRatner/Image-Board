console.log("script is linked");

(function () {
    new Vue({
        el: "#main",
        data: {
            name: "",
            seen: true,
            cities: [],
        }, //data ends

        mounted: function () {
            //console.log("my vue instance has mounted");

            console.log("this outside axios:", this);

            var self = this;

            axios.get("cities").then(function (response) {
                console.log("this insde axios: ", self);
                console.log("response from /cities", response.data);
                self.cities = response.data;
            });
        },

        methods: {
            myFunction: function () {
                console.log(
                    "myFunction is running! EACH FUNCTION HAS TO BE IN METHODS"
                );
            },
        }, //methods ends
    });
})();
