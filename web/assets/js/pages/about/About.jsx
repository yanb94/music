import React from 'react'
import './About.scss'
import Header from '@app/module/header/Header'
import image from '../../../image/about-head.jpg'

export default function About(){
    return <div className="about--head">
        <Header
            title="A propos - Song"
            description="Découvrez l'histoire de Song, la platforme des passionés de musique"
            ogOption={{
                image: image
            }}
            twitterOption={{
                image: image 
            }}
        />
        <div className="about--head--image"></div>
        <div className="about--head--content">
            <div className="about--head--content--container">
                <div className="about--head--content--title">
                    Song
                </div>
                <div className="about--head--content--subTitle">
                    La plateforme des passionnés de musique
                </div>
                <div className="about--head--content--text">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi condimentum eros tristique hendrerit varius. Praesent semper, quam id tempor posuere, orci urna facilisis ligula, ac molestie justo lorem commodo tellus. Etiam rutrum nibh nec justo lacinia tristique. Fusce eu imperdiet leo. Proin felis dui, lacinia in congue fringilla, ultrices non odio. Sed venenatis justo vitae pharetra maximus. Duis fermentum mauris ex, non sagittis urna interdum quis. Vivamus quis sodales nibh, ut tempus turpis. Duis ac ex consectetur, tincidunt felis ac, elementum massa.
                </div>
            </div>
        </div>
    </div>
}