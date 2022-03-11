import {
    SpotifyApi
} from "./api/api.js";
import {
    Player
} from "./player.js";
import {
    millisToMinutesAndSeconds
} from './utils.js'

const clientId = 'f03d452f6b3647c38ab26ad5f8cc8629';
const secret = '8848ff822526499f9d0ba968f87807b3';

const card = document.getElementById('card');
const track = document.getElementById('track');
const search = document.getElementById('search');
const content = document.getElementById('content');

const play = document.querySelector('.play_button');

const spotify = new SpotifyApi(clientId, secret);
const player = new Player();

function addPlaylistElements(el, items, playlistName = '') {
    const playlist = document.createElement('div');
    playlist.classList.add('playlist');
    const title = document.createElement('h2');
    title.classList.add('title');
    title.textContent = playlistName;


    items.slice(0, 8).forEach((item) => {
        const cardItem = document.createElement('div');
        cardItem.innerHTML = card.innerHTML;
        cardItem.classList.add('card');
        cardItem.querySelector('.card_image').setAttribute('src', item.images[0].url);
        cardItem.querySelector('.card_title').textContent = item.name;
        cardItem.querySelector('.card_description').textContent = item.description && item.description.slice(0, 55);
        playlist.append(cardItem);
    });

    if (!items.length) {
        playlist.textContent = 'Ничего не найдено';
    }

    el.append(title);
    el.append(playlist);
}

function addTracks(el, items) {
    const tracksElement = document.createElement('div');
    tracksElement.classList.add('tracks');
    const title = document.createElement('h2');
    title.classList.add('title');
    title.textContent = 'Найденные треки';

    items.forEach(async (item, i) => {
        const tracks = document.createElement('div');
        tracks.innerHTML = track.innerHTML;
        tracks.classList.add('tracks_item');
        tracks.querySelector('.tracks_item_info-play-image').setAttribute('src', item.album.images[0].url);
        tracks.querySelector('.tracks_item_info-album-name').textContent = item.name;
        tracks.querySelector('.tracks_item_info-album-artist').textContent = item.artists[0].name;
        tracks.querySelector('.tracks_item-ms').textContent = millisToMinutesAndSeconds(item.duration_ms);
        tracks.addEventListener('click', async () => {
            player.track = item.name;
            addTrackInfo(item.album.images[0].url, item.name, item.artists[0].name);
        })
        player.addTrack(await spotify.getTrack(item.id));
        tracksElement.append(tracks);
    });

    if (!items.length) {
        tracksElement.textContent = 'Ничего не найдено';
    }

    el.append(title);
    el.append(tracksElement);
}

async function loadContent() {
    if (await spotify.token) {
        const featuredPlaylists = await spotify.getFeaturedPlaylists();
        const newReleasesPlaylist = await spotify.getNewReleasesPlaylist();

        addPlaylistElements(content, featuredPlaylists.playlists.items, featuredPlaylists.message);
        addPlaylistElements(content, newReleasesPlaylist.albums.items, 'Новые релизы');
    }
}

function addTrackInfo(img, name, artist) {
    const player = document.getElementById('track-info');
    player.querySelector('.player_info-img').setAttribute('src', img);
    player.querySelector('.player_info-album-name').textContent = name;
    player.querySelector('.player_info-album-artist').textContent = artist;
}


window.addEventListener('DOMContentLoaded', async () => {

    if (await spotify.token) {
        const featuredPlaylists = await spotify.getFeaturedPlaylists();
        const newReleasesPlaylist = await spotify.getNewReleasesPlaylist();

        addPlaylistElements(content, featuredPlaylists.playlists.items, featuredPlaylists.message);
        addPlaylistElements(content, newReleasesPlaylist.albums.items, 'Новые релизы');
    }
});


search.addEventListener('input', async (e) => {
    const query = e.target.value;
    if (query.length > 3) {
        const res = await spotify.getSearchResults(query);
        content.innerHTML = '';
        addPlaylistElements(content, res.playlists.items, 'Плейлисты');
        addTracks(content, res.tracks.items);
        player.arrTracks;
        return;
    }
    if (!query.length) {
        content.innerHTML = '';
        loadContent();
    }
});

play.addEventListener('click', () => {
    player.play();
});