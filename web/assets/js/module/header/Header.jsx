import React from 'react'
import { Helmet } from 'react-helmet'


export default function Header({
    title,
    description,
    ogOption,
    twitterOption,
    canonical
})
{
    if(canonical == null)
        canonical = window.location.href

    return <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical}/>

        {ogOption ? <meta property="og:url" content={canonical} /> : ""}
        {ogOption ? <meta property="og:type" content="article" /> : ""}
        {ogOption ? <meta property="og:title" content={ogOption?.title ?? title}/> : ""}
        {ogOption ? <meta property="og:description" content={ogOption?.description ?? description}/> : ""}
        {ogOption?.image ? <meta property="og:image" content={ogOption.image} /> : ""}

        {twitterOption ? <meta name="twitter:card" content="summary" /> : ""}
        {twitterOption ? <meta name="twitter:site" content="@song" /> : ""}
        {twitterOption ? <meta name="twitter:title" content={twitterOption?.title ?? title} /> : ""}
        {twitterOption ? <meta name="twitter:description" content={twitterOption?.description ?? description} /> : ""}
        {twitterOption?.image ? <meta name="twitter:image" content={twitterOption.image} /> : ""}

    </Helmet>
}