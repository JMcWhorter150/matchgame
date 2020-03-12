import React, { useState, useEffect, useContext } from 'react';
import { Container, Content, ListItem, Text, Radio, Button, Right, Left, Footer, FooterTab, Toast } from 'native-base';
import axios from 'axios';
import {URL} from 'react-native-dotenv';
import SignupContext from './SignupContext';

export default function SignupPageThree({ navigation }) {

    const context = useContext(SignupContext);
    const {sports} = context.state;
    const {onSportSelect} = context.actions;
    const [sportsList, setSportsList] = useState(null);

    useEffect(() => {
        async function fetchSportsData() {
            try{
                const url = `${URL}/sports`;
                const response = await axios.get(url);
                setSportsList(response.data);
            } catch(err) {
                console.log(err);
            }
        }
        fetchSportsData();
    }, [])
    
    return(
        <Container>
            <Content>
            {
                sportsList ? sportsList.map((sport) => {
                    return (
                        <ListItem onPress={() => onSportSelect(sport)} key={sport.id + 'r'}>
                            <Left>
                                <Text>{sport.name}</Text>
                            </Left>
                            <Right>
                                <Radio selected={sports.filter(item => item.name === sport.name).length > 0} />
                            </Right>
                        </ListItem>
                    )
                }) :
                null
            }
            </Content>
            <Footer>
                <FooterTab>
                    <Button
                    onPress={() => {navigation.goBack()}}
                    >
                    <Text style={{fontSize: 15}}>PREV</Text>
                    </Button>
                </FooterTab>
                <FooterTab>
                    <Button
                    onPress={() => {
                        if(sports.length) {
                            navigation.navigate('Review');
                        } else {
                            Toast.show({
                                text:"Select at least one sport to continue",
                                buttonText:"Okay",
                                position:"top"
                            });
                        }
                        
                    }}
                    >
                    <Text style={{fontSize: 15}}>NEXT</Text>
                    </Button>
                </FooterTab>
            </Footer>
        </Container>

    );
}