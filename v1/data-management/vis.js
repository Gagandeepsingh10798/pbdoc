// const { visDataManagement } = require(".");
const Models = require("../../data-models");
const visDataManagement = function () {
    const vis = Models.vis;
    this.addVis = async (credentials) => {
        try {
            var n = new vis;
            var obj = {};
            credentials.nodes.forEach(e=>{
                obj = {},
               obj.id = e.id,
               obj.label = e.label,
               obj.title = e.title,
               obj.x = e.x,
               obj.y = e.y,
               n.nodes.push(obj)
            });
            obj = {},
            credentials.edges.forEach(e=>{
                obj = {},
               obj.from = e.from,
               obj.to = e.to
               n.edges.push(obj)
            }),
            n.save(()=>{
                console.log("saved to db");
            });
            console.log(n);
            return n
        } catch (err) {
          throw err;
        }
      };
      this.editVis= async (credentials) => {
        try {
              var n = new vis;
              var obj = {};
              credentials.nodes.forEach(e=>{
               obj = {},
               obj.id = e.id,
               obj.label = e.label,
               obj.title = e.title,
               obj.x = e.x,
               obj.y = e.y,
               n.nodes.push(obj)
            });
            obj = {},
            credentials.edges.forEach(e=>{
                obj = {},
               obj.from = e.from,
               obj.to = e.to
               n.edges.push(obj)
            }),
            n.save(()=>{
                console.log("saved to db");
            });
            console.log(n);
            return n
        } catch (err) {
          throw err;
        }
      };
};
    module.exports = visDataManagement;
