import React from 'react'
import "./MemberSpace.scss"
import CardMenuMember from '@app/module/card-menu-member/CardMenuMember'
import { useRouteMatch } from 'react-router-dom';
import { useAuth } from '@app/auth/auth';
import initListItem from './listItem';
import Header from '@app/module/header/Header';

export default function MemberSpace()
{
    let { path, url } = useRouteMatch();

    const { auth } = useAuth();

    const listCard = initListItem(auth)

    const instanciateCard = () => {
        return listCard.map((value,index) => (value.condition == null || value.condition == true ) ? <CardMenuMember key={index} name={value.name} icon={value.icon} link={value.link} /> : "")
    }

    return <div className="member-space">
        <Header
            title="Espace Membre"
            description="Gérer vos activitées sur song"
        />
        {instanciateCard()}
    </div>
}