import React, {useState, useEffect, useContext} from 'react';
import {StyleSheet} from 'react-native';
import {Container, Content, Header, Item, Input, Icon, Button, Footer, FooterTab, H1, Text, Left, Right } from 'native-base';
import {FlatList} from 'react-native';

import TeamContext from './TeamContext';
import UserContext from '../../UserContext';
import PlayerTeamCard from './PlayerTeamCard';

import axios from 'axios';
import {URL} from 'react-native-dotenv';

// make filter text check be all lowercase
// make a different function for adding members and removing members

export default function TeamMemberSelect({ navigation }) {
    const [searchInput, setSearchInput] = useState(null);
    const [userList, setUserList] = useState(null);
    const [currentUserList, setCurrentUserList] = useState(null);

    const {userToken} = useContext(UserContext).state;
    const {state, actions} = useContext(TeamContext);
    const {teamMembers} = state;
    const {handleTeamMemberAdd} = actions;

    useEffect(() => {
        if(!userList) {
            try{
                axios.get(`${URL}/users/`, {headers: {"x-access-token": userToken}}).then(
                    r => {
                        setUserList(r.data);
                        setCurrentUserList(r.data);
                    }
                )
            } catch(err) {
                console.log(err);
            }
        }
    }, [])

    const filterUsers = (text) => {
        const filteredResults = userList.filter((item) => item.username.includes(text))
        setCurrentUserList(filteredResults);
    }

    const convertTeamMembers = (obj) => {
        const newArr = Object.keys(obj).map(item => {return {id: item, name: obj[item]}});
        return newArr;
    }

    const styles = StyleSheet.create({
        container: {
            backgroundColor: '#fafafa'
        },

    });

    return(
        <Container>
            <Content style={styles.container}>
                <Header searchBar rounded>
                    <Item>
                        <Icon name="ios-search" />
                        <Input placeholder="Search" value={searchInput} onChangeText={setSearchInput} />
                        <Button transparent onPress={() => filterUsers(searchInput)}>
                            <Text>Search</Text>
                        </Button>
                    </Item>
                </Header>
                    {/* <H1 style={{textAlign: "center", padding: 10}}>Select Users</H1> */}
                    <FlatList
                        data={currentUserList}
                        renderItem={ ({ item }) => (
                            <PlayerTeamCard
                            keyExtractor={item.id}
                            cardData={item}
                            handleSelect={handleTeamMemberAdd}
                            />
                        )} />
                    <H1 style={{textAlign: "center", padding: 10}}>Users Selected</H1>
                    <FlatList
                        data={convertTeamMembers(teamMembers)}
                        renderItem={ ({ item }) => (
                            <Item keyExtractor={item.id} style={{marginTop: 10, paddingBottom: 10}}>
                                <Left>
                                    <Text>
                                        {item.name}
                                    </Text>
                                </Left>
                                <Right>
                                    <Button onPress={() => handleTeamMemberAdd(item.id, item.name)}>
                                        <Text>
                                            Remove
                                        </Text>
                                    </Button>
                                </Right>
                            </Item>
                        )} />
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
                    onPress={() => {navigation.navigate('teamReview')}}
                    >
                    <Text style={{fontSize: 15}}>NEXT</Text>
                    </Button>
                </FooterTab>
            </Footer>
        </Container>
  );
}