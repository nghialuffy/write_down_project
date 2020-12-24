import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { DataAccess } from '../../../../access';
import { CategoryImage } from '../../../../assets/Images';
import { BaseButton } from '../../../../components';
import { UserContext } from '../../../../context';
import { CategoryType } from '../../../../model';
import './style.scss';

export function CategoryItem({ data }: { data: CategoryType }) {
    const userContext = useContext(UserContext);
    let follow = userContext.followCategories.filter(item => item.url === data.url).length > 0 ? true : false;
    const [status, setStatus] = useState(follow);
    const [loading, setLoading] = useState(false);

    const followHandler = (action: 'follow' | 'unfollow') => {
        setLoading(true);
        DataAccess.Post(`categories/${data.url}/${action}`).then(() => {
            setStatus(!status);
            userContext.getFollowingCategories();
            setLoading(false);
        }).catch(e => {
            console.log('Error > ', e);
            setLoading(false);
        })
    }
    return (
        <div className='category-item-container'>
            <Link
                to={`/posts/${data.url}`}
                className='category-item'
                style={{ backgroundImage: `url(${CategoryImage[data.url] ? CategoryImage[data.url].default : CategoryImage.science.defaault})` }}
            >
                <div className='category-label'>{data.name_category}</div>
            </Link>
            {userContext._id && (status ? <BaseButton loading={loading} className='btn-follow' onClick={(e) => {
                followHandler('unfollow');
                e.stopPropagation();
            }}>
                Hủy theo dõi
            </BaseButton> : <BaseButton loading={loading} type='primary' className='btn-follow' onClick={(e) => {
                    followHandler('follow');
                    e.stopPropagation();
                }}>
                    Theo dõi
            </BaseButton>)}
        </div>
    )
} 