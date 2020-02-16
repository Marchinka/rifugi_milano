var spotController = (function() {
    var getSpots = function(callback) {
        RM.utils.ajax({
            url: "/spots", method: "GET"
        }, function (resp) {
            callback(resp);
        });
    };

    var saveSpot = function(spot, callback) {
        RM.utils.ajax({
            url: "/spot", method: "POST", data: spot
          }, function (resp) {
            callback(resp);
        });
    };

    var deleteSpot = function(id, callback) {
        RM.utils.ajax({
            url: "/spot/" + id, method: "DELETE"
          }, function (resp) {
            callback(resp);
        });
    };

    return {
        getSpots: getSpots,
        saveSpot: saveSpot,
        deleteSpot: deleteSpot
    };
})();