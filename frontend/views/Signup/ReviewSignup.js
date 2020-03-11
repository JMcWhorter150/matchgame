import React, { useState, useContext } from 'react';
import { Image } from 'react-native';
import { Container, List, ListItem, Left, Body, Text, Button, Footer, FooterTab, Content, Spinner } from 'native-base';
import axios from 'axios';
import { URL } from 'react-native-dotenv';
import SignupContext from './SignupContext';
import UserContext from '../../UserContext';

export default function SignupPageFour({ navigation }) {
    const { username, nickname, password, email, sports, selectedImage, locationId } = useContext(SignupContext).state;
    const { setUserData, setHasSignedUp } = useContext(UserContext).actions;
    const [userObject, setUserObject] = useState({
        user: {
            username,
            email,
            password,
            photo: selectedImage,
            city_id: locationId.id,
            player_rating: 5,
            nickname}
        });

    const [sportsArray, setSportsArray] = useState(sports.map(sport => {return {sport_id: sport.id}}));
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const postUser = async () => {
        const url = `${URL}/signup/`
        const response = await axios.post(url, userObject);
        console.log(response.data);
        setUserData(response.data);
        return response.data;
    };
    const postSports = async (token) => {
        const url = `${URL}/favorite-sports/`;
        const sportsArrayObject = {favoriteSports:sportsArray.map(sport => {return {...sport, user_id: null}})};
        const response = await axios.post(url, sportsArrayObject, {
            headers: {
                "x-access-token": token
            }
        });
        // add error handling here
    };

    const postSignupData = async () => {
        const data = await postUser();
        postSports(data);
        return false; // change this for error handling
    }

    return(
        <Container>
            <Content>
                <List>
                    <ListItem>
                        <Left>
                            <Text>
                                Username:
                            </Text>
                        </Left>
                        <Body>
                            <Text>
                                {username}
                            </Text>
                        </Body>
                    </ListItem>
                    <ListItem>
                        <Left>
                            <Text>
                                Nickname:
                            </Text>
                        </Left>
                        <Body>
                            <Text>
                                {nickname}
                            </Text>
                        </Body>
                    </ListItem>
                    <ListItem>
                        <Left>
                            <Text>
                                Email:
                            </Text>
                        </Left>
                        <Body>
                            <Text>
                                {email}
                            </Text>
                        </Body>
                    </ListItem>
                    <ListItem>
                        <Left>
                            <Text>
                                City:
                            </Text>
                        </Left>
                        <Body>
                            <Text>
                                {locationId.city}
                            </Text>
                        </Body>
                    </ListItem>
                    <ListItem>
                        <Left>
                            <Text>
                                Favorite Sports:
                            </Text>
                        </Left>
                        <Body>
                            <List>
                                {sports.map((sport) => (
                                        <Text key={sport.id+"sport"}>{sport.name}</Text>
                                ))}
                            </List>
                        </Body>
                    </ListItem>
                    <ListItem>
                        <Left>
                            <Text>Picture:</Text>
                        </Left>
                        <Body>
                            <Image style={{width: 100, height: 100}} source={{uri: selectedImage}} />
                        </Body>
                    </ListItem>
                </List>
                {isSubmitting ? <Spinner /> : null}
            </Content>
            <Footer>
                <FooterTab>
                    <Button
                    onPress={() => {navigation.goBack()}}
                    >
                        <Text>PREV</Text>
                    </Button>
                </FooterTab>
                <FooterTab>
                    <Button
                    onPress={async () => {
                        setIsSubmitting(true);
                        const wasSubmitted = await postSignupData();
                        setIsSubmitting(wasSubmitted);
                        setHasSignedUp(true);
                        !wasSubmitted ? navigation.navigate('User Login') : console.log('error in submission');
                    }}
                    >
                        <Text>Submit</Text>
                    </Button>
                </FooterTab>
            </Footer>
        </Container>
    );

}
