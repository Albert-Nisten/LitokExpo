import React, { useContext } from 'react';
import {View, StyleSheet, useWindowDimensions} from 'react-native';
import { Context } from '../Context';
import { TockStyles } from '../tockElements/TockStyles';
import Feed from './Feed';
import FeedCategories from './FeedCategories';
import { Text } from 'react-native-paper';
import TockAlert from '../tockElements/TockAlert';

const Home = () => {
    const {user} = useContext(Context)

    return (
        <View style = {TockStyles.container}>
            <Feed/>
        </View>
    );
}

const styles = StyleSheet.create({})

export default Home;
