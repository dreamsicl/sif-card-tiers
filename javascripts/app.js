var app = angular.module('tierList', ['ui.bootstrap']);

// TODO: loading spinner

app.factory('Cards', function($http) {

    var ret = {};





    ret.getCards = function(url) {
        return $http.get(url);
    }

    ret.cleanCards = function(cards) {
        var len = cards.length;
        for (var i = 0; i < len; i++) {
            delete cards[i].idol.note;
            delete cards[i].idol.year;
            delete cards[i].idol.school;
            delete cards[i].idol.chibi;
            delete cards[i].idol.main_unit;
            delete cards[i].idol.chibi_small;
            delete cards[i].idol.sub_unit;
            delete cards[i].japanese_center_skill;
            delete cards[i].japanese_center_skill_details;
            delete cards[i].video_story;
            delete cards[i].japanese_video_story;
            delete cards[i].ur_pair;
            delete cards[i].total_wishlist;
            delete cards[i].ranking_attribute;
            delete cards[i].ranking_rarity;
            delete cards[i].ranking_special;
            delete cards[i].release_date;
            delete cards[i].is_special;
            delete cards[i].japanese_skill_details;
            delete cards[i].japanese_skill;
            delete cards[i].card_image;
            delete cards[i].card_idolized_image;
            delete cards[i].english_card_image;
            delete cards[i].english_card_idolized_image;
            delete cards[i].transparent_image;
            delete cards[i].transparent_idolized_image;
            delete cards[i].clean_ur;
            delete cards[i].clean_ur_idolized;
            delete cards[i].skill_up_cards;
            delete cards[i].total_owners;
            //delete cards[i].event.note;
            delete cards[i].promo_item;
            delete cards[i].promo_link;
            delete cards[i].promo_item;
            cards[i].premium = (!cards[i].event) && (!cards[i].is_promo);

        }
        return cards;
    }

    return ret;
});


app.controller('TierCtrl', function($scope, $filter, Cards) {
    $scope.cardsBase = "jp";
    $scope.cardsBase.upcoming = false;
    $scope.filters = {
        attribute: 'all',
    }

    $scope.cards = [];

    var count = 0;
    var getCardsSuccess = function(data, status) {
        count = data.count;
        $scope.cards = data.results;
        $scope.cards = Cards.cleanCards($scope.cards);
    }


    $scope.url = "https://crossorigin.me/http://schoolido.lu/api/cards/?&page_size=50&ordering=-id&rarity=SR,UR&japan-only=true";
    var base = "https://crossorigin.me/http://schoolido.lu/api/cards/?&page_size=50&ordering=-id";
    $scope.$watch('filters', function(n, o) {
        if (n !== o) {
            console.log("changed filters")
            console.log($scope.filters)
            $scope.filters = n;

            if (n.attribute == 'smile') base += "&attribute=smile";
            if (n.attribute == 'pure') base += "&attribute=pure";
            if (n.attribute == 'cool') base += "&attribute=cool";

            $scope.url = base;

        }
    })

    $scope.getCards = function() {
        Cards.getCards($scope.url).success(getCardsSuccess);
    };

    $scope.sort = {
        reverse: true,
        type: 'id',
        typeAttr: ''
    };
    $scope.sortBy = function(type) {
        $scope.sort.reverse = ($scope.sort.type == type) || ($scope.sort.typeAttr == type) ? !$scope.sort.reverse : true;
        $scope.sort.typeAttr = type;

        if (type == 'smile' && $scope.filters.idlz)
            $scope.sort.type = "idolized_maximum_statistics_smile";
        else if (type == 'smile' && !$scope.filters.idlz)
            $scope.sort.type = "non_idolized_maximum_statistics_smile";
        else if (type == 'pure' && $scope.filters.idlz)
            $scope.sort.type = "idolized_maximum_statistics_pure";
        else if (type == 'pure' && !$scope.filters.idlz)
            $scope.sort.type = "non_idolized_maximum_statistics_pure";
        else if (type == 'cool' && $scope.filters.idlz)
            $scope.sort.type = "idolized_maximum_statistics_cool";
        else if (type == 'cool' && !$scope.filters.idlz)
            $scope.sort.type = "non_idolized_maximum_statistics_cool";
        else $scope.sort.type = type;

    };



    // TODO: filter by server
    // TODO: filter by attribute
    // TODO: filter by rarity
    // TODO: filter by origin
    $scope.byOrigin = function(card) {
        /*var ret = ($scope.filters.premium == card.premium) ||
        ($scope.filters.promo == card.is_promo) ||
        ($scope.filters.event == card.event);
        console.log(ret);*/
        var filterPremium = ($scope.filters.premium == card.premium);
        var filterPromo = ($scope.filters.promo == card.is_promo);
        var filterEvent = ($scope.filters.evnt == (card.event == null));
        var showIf = filterPremium && filterPromo && filterEvent;
        return filterPremium;
    };
    // TODO: filter by group
    // TODO: filter by skill
    // TODO: display by idlz


    // TODO: parse skill for info
    // TODO: calculate skill contribution
    //****** calculate total card strength: center skill, secondary skill, friend skill, bond
    var stat_to_mod = function(card) {
            if ($scope.filters.idlz && (card.attribute == "Pure"))
                stat = card.idolized_maximum_statistics_pure;
            else if (!$scope.filters.idlz && (card.attribute == "Pure"))
                stat = card.non_idolized_maximum_statistics_pure;
            else if ($scope.filters.idlz && (card.attribute == "Smile"))
                stat = card.idolized_maximum_statistics_smile;
            else if (!$scope.filters.idlz && (card.attribute == "Smile"))
                stat = card.non_idolized_maximum_statistics_smile;
            else if ($scope.filters.idlz && (card.attribute == "Cool"))
                stat = card.idolized_maximum_statistics_cool;
            else if (!$scope.filters.idlz && (card.attribute == "Cool"))
                stat = card.non_idolized_maximum_statistics_cool;

            // bond bonus
            if ($scope.filters.idlz && card.rarity == "UR")
                stat += 1000;
            else if ((!$scope.filters.idlz && card.rarity == "UR") || ($scope.filters.idlz && card.rarity == "SR"))
                stat += 500;
            else if (!$scope.filters.idlz && card.rarity == "SR")
                stat += 250;
            return stat;
        }
        // common center skill bonus
    var calcLeaderSkillBonus = function(card, type) {
        var statToMod = stat_to_mod(card);
        if (type == "common") return statToMod + (statToMod * (.09 + .03)) * 2;
        else if (type == "optimal") return statToMod + (statToMod * (.09 + .06)) * 2;
        else return false;
    };
    // optimal center skill bonus
    $scope.cScore = function(card) {
        card.cScore = calcLeaderSkillBonus(card, "common");
        return card.cScore
    }
    $scope.oScore = function(card) {
        card.oScore = calcLeaderSkillBonus(card, "optimal");
        return card.oScore
    }
    var stat = 0;
    // TODO: pagination

});
