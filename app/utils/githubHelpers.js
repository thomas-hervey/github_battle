const axios = require('axios');

const id = "dbae349f386313a79a21";
const sec = "759deb3320dbdae80630af4b3c61c1b78ea0b397";
const param = "?client_id=" + id + "&client_secret=" + sec;

function getUserInfo (username) {
    return axios.get('https://api.github.com/users/' + username + param);
}

function getRepos (username) {
    // fetch github username
    return axios.get('https://api.github.com/users/' + username + '/repos' + param + '&per_page=100');
}

function getTotalStars (repos) {
    // calculate all stars based on repos
    return repos.data.reduce(function (prev, current) {
        return prev + current.stargazers_count
    }, 0)
}

function getPlayersData(player) {
    // get repos
    return getRepos(player.login)
        // pass to stars
        .then(getTotalStars)
        // return object with data
        .then(function (totalStars) {
            return {
                followers: player.followers,
                totalStars: totalStars
            }
        });
}

function calculateScores (players) {
    // return an array
    return [
        players[0].followers * 3 + players[0].totalStars,
        players[1].followers * 3 + players[1].totalStars

    ]
}



const helpers = {
    getPlayersInfo: function (players) {
        return axios.all(players.map(function (username) {
            return getUserInfo(username)
        }))
            .then(function (info) {
                return info.map(function (user) {
                    return user.data
                })
            })
            .catch(function (err) {console.warn('Error in getPlayersInfo: ', err)})
    },
    battle: function (players) {
        let playerOneData = getPlayersData(players[0]);
        let playerTwoData = getPlayersData(players[1]);
        
        return axios.all([playerOneData, playerTwoData])
            .then(calculateScores)
            .catch(function (err) {
                console.warn('Error in getPlayersInfo', err);
            })
    }
};

module.exports = helpers;