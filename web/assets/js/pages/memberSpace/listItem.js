export default function initListItem(auth)
{
    return [
        {
            name: "Modifier mes infos",
            icon: "fas fa-user",
            link: "/edit-infos"
        },
        {
            name: "Changer de mot de passe",
            icon: "fas fa-key",
            link: "/change-password"
        },
        {
            name: "Changer d'email",
            icon: "fas fa-at",
            link: "/change-email"
        },
        {
            name: "Mes abonnements",
            icon: "far fa-play-circle",
            link: "/my-follow-content"
        },
        {
            name: "Mes playlists",
            icon: "fas fa-headphones",
            link: "/my-playlists"
        },
        {
            name: "Gérer ma souscription",
            icon: "far fa-money-bill-alt",
            link: "/subscribe"
        },
        {
            name: "Mes chansons",
            icon: "fas fa-music",
            link: "/my-songs",
            condition: auth.artist
        },
        {
            name: "Devenir artiste",
            icon: "fas fa-microphone",
            link: "/artist-space",
            condition: !auth.artist
        },
        {
            name: "Modifier mon profil d'artiste",
            icon: "fas fa-microphone",
            link: "/edit-artist-space",
            condition: auth.artist
        },
        {
            name: "Supprimer mon profil d'artiste",
            icon: "fas fa-microphone-alt-slash",
            link: "/delete-artist",
            condition: auth.artist
        },
        {
            name: "Mes Statistiques",
            icon: "fas fa-chart-line",
            link: "/stats",
            condition: auth.artist
        }
    ]
}