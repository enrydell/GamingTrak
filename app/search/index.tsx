import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import secrets from '../../secrets.json';

const styles = StyleSheet.create({
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        borderRadius: 10
    },
});

type Game = {
    id: number
    name: string
    summary: string
    coverUrl: string | undefined
}

// type GameData = {
//     id: number
//     slug: string
//     name: string
//     background_image: string
// }

// type Game = {
//     count: number
//     next: string
//     previous: string
//     user_platforms: boolean
//     results: [GameData]
// }

export default function Index() {
    const placeholder = "Search for a game";
    const [text, onChangeText] = useState('');
    const [data, setData] = useState<Game[]>([])

    const updateItemValue = (idToUpdate: number, newValue: Game) => {
        setData(prevData =>
            prevData.map(item =>
                item.id === idToUpdate
                ? newValue // Create new object with updated value
                : item // Return original object
            )
        );
    };

    const getGamesByName = async () => {
        try {
            const response = await fetch('https://api.igdb.com/v4/games', {
                method: 'POST',
                headers: {
                    'Client-ID': secrets.igdb['client-id'],
                    'Authorization': `Bearer "${secrets.igdb.bearer}"`
                },
                body: `fields *; search "${text}";`
            });

            // const api_key: string = secrets.rawg.apiKey
            // const response = await fetch(`https://api.rawg.io/api/games?key=${api_key}&search=${text}`, {
            //     method: 'GET'
            // });

            const json = await response.json();
            setData(json);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const handler = setTimeout(() => {
          getGamesByName()
        }, 1000); // debounce delay

        return () => {
          clearTimeout(handler);
        };
    }, [text])

    const getGameCoverByID = async (gameId: number): Promise<String> => {
        try {
            const response = await fetch('https://api.igdb.com/v4/covers', {
                method: 'POST',
                headers: {
                    'Client-ID': secrets.igdb['client-id'],
                    'Authorization': `Bearer "${secrets.igdb.bearer}"`
                },
                body: `fields *; where game = ${gameId};`
            });

            const json = await response.json();

            if (json.length > 0) {
                return json[0].image_id
            } else {
                return ""
            }
        } catch (error) {
            console.error(error);
            return ""
        }
    };

    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <ScrollView>
                <TextInput
                    style={styles.input}
                    onChangeText={onChangeText}
                    value={text}
                    placeholder={placeholder}
                    keyboardType="default"
                />

                {
                    data.map(async (game) => {
                        {
                            const imageId = await getGameCoverByID(game.id)
                            console.log(imageId)
                            // updateItemValue(game.id, {
                            //     ...game,
                            //     coverUrl: `https://images.igdb.com/igdb/image/upload/t_cover_big/${imageId}.web`
                            // })
                        }


                       return (
                         <View style={
                            [
                                {
                                    flexDirection: "column",
                                    margin: 20
                                }
                            ]
                        }>
                            {/* <Image
                                source={{ uri: `https://images.igdb.com/igdb/image/upload/t_cover_big/${getGameCoverByID(game.id)}.web` }}
                                style={{ width: 100, height: 100 }}
                            /> */}
                            {/* <Text>{`https://images.igdb.com/igdb/image/upload/t_cover_big/${getGameCoverByID(game.id)}.web`}</Text> */}
                            {/* <Text>{getGameCoverByID(game.id).then((imageId) => `https://images.igdb.com/igdb/image/upload/t_cover_big/${imageId}.web`)}</Text> */}
                            <Text>{game.coverUrl}</Text>
                            <Text>{game.id}</Text>
                            <Text>{game.name}</Text>
                            <Text>{game.summary}</Text>

                            {/* <Text>{game.id}</Text>
                            <Text>{game.name}</Text>
                            <Text>{game.slug}</Text> */}
                        </View>
                       );
                    })
                }
            </ScrollView>
        </View>
    );
}
