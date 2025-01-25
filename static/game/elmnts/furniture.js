
// Start of Selection
function getFurniture() {
    return [
            {
                "name": "Dresser",
                "room": "My Bedroom",
                "pos": {
                    "x": 3,
                    "y": 17
                },
                "reward": "lockpick",
                "state": "unsearchable",
                "in_use": false,
                "search_msg":"Ok um, I think this is a lockpick 🔐. Why do you even have this?",
                "sprite": [
                    {
                        "for": "searchable",
                        "img": "/assets/img/appartment/dressersearchable.png"
                    },
                    {
                        "for": "unsearchable",
                        "img": "/assets/img/appartment/dresserunsearchable.png"
                    }
                ]
            }, 
            {
                "name": "Bedroom Door",
                "room": "My Bedroom",
                "locked": true,
                "wall_pos": {
                    "x": 9,
                    "y": 15
                },
                "stop_pos":{
                    "x": 8,
                    "y": 15
                }
                ,
                "state": "unlocked",
                "in_use": false,
                "locked_message":"It's locked, I can't get out!! Why is it locked??",
                "unlocked_message":"Ok it's open! 🥳",
                "sprite": [
                    {
                        "for": "locked",
                        "img": "/assets/img/appartment/bedroomdoorlocked.png"
                    },
                    {
                        "for": "unlocked",
                        "img": "/assets/img/appartment/bedroomdoorunlocked.png"
                    }
                ]
            }, 
            {
                "name": "Coffee Table",
                "room": "living",
                "pos": {
                    "x": 15,
                    "y": 21
                },
                "state": "unusable",
                "in_use": false,
                "key":"oil",
                "reward":"remote",
                "locked_msg":"Ugh the drawer doesn't open, it's like it's rusty or jammed or smthn. Gotta loosen it somehow",
                "unlocked_msg":"This is kinda gross 🤢 k it's open, got the remote 📱",
                "sprite": [
                    {
                        "for": "usable",
                        "img": "/assets/img/appartment/coffeetableusable.png"
                    },
                    {
                        "for": "unusable",
                        "img": "/assets/img/appartment/coffeetableunusable.png"
                    }
                ]
            },
            {
                "name": "TV",
                "room": "living",
                "pos": {
                    "x": 17,
                    "y": 20
                },
                "state": "used",
                "in_use": false,
                "key":"remote",
                "generator_on":false,
                "locked_msg":"I need a remote to turn this on",
                "locked_msg_generator_off":"oh shit there's no power i can't turn the tv on",
                "unlocked_msg":"ok it's on... um... it's just some static. i think i see a word in there. It says ETHER. Any ideas wtf that means?",
                "sprite": [
                    {
                        "for": "used",
                        "img": "/assets/img/appartment/tvused.png"
                    },
                    {
                        "for": "unused",
                        "img": "/assets/img/appartment/tvunused.png"
                    }
                ]
            },
            {
                "name": "Bookcase",
                "room": "Guest Bedroom",
                "pos": {
                    "x": 28,
                    "y": 14
                },
                "state": "searchable",
                "in_use": true,
                "key":"Desk Note",
                "reward":"Flashlight",
                "locked_msg":"There's like a shit ton of books in here in a bunch of different colors, i have no idea what i'm looking for... 😵‍💫",
                "unlocked_msg":"Got the pink book. Looks like it's hollowed out and there's a flashlight inside 🔦. WEIRD?? there's also some writing here that says the mouth holds the key. omg that's so creepy wtf",
                "sprite": [
                    {
                        "for": "searchable",
                        "img": "/assets/img/appartment/bookcasesearchable.png"
                    },
                    {
                        "for": "usable",
                        "img": "/assets/img/appartment/bookcaseusable.png"
                    },
                    {
                        "for": "unusable",
                        "img": "/assets/img/appartment/bookcaseunusuable.png"
                    }
                ]
            },
            
            {
                "name": "Generator",
                "room": "basement",
                "pos": {
                    "x": 3,
                    "y": 2
                },
                "state": "off",
                "in_use": false,
                "sprite": [
                    {
                        "for": "off",
                        "img": "/assets/img/appartment/generatoroff.png"
                    },
                    {
                        "for": "on",
                        "img": "/assets/img/appartment/generatoron.png"
                    }
                ]
            },
            {
                "name": "Dead Body",
                "room": "Storage",
                "pos": {
                    "x": 3,
                    "y": 4
                },
                "state": "usable",
                "in_use": true,
                "key":"Knife",
                "locked_msg":"um... what. the. fuck. IS THIS A DEAD BODY?? WHO ARE YOU??",
                "unlocked_msg":"no no no no no ew ew ew ew whyyyyyyy...😭😭😭 theres a note here that says NEO. why the f was there a note in its mouth??",
                "sprite": [
                    {
                        "for": "usable",
                        "img": "/assets/img/appartment/deadbodyusable.png"
                    },
                    {
                        "for": "unusable",
                        "img": "/assets/img/appartment/deadbodyunusable.png"
                    }
                ]
            },
            {
                "name": "Desk",
                "room": "office",
                "pos": {
                    "x": 20,
                    "y": 9
                },
                "reward": "Desk Note",
                "state": "unsearchable",
                "in_use": false,
                "search_msg":"There's a note on your desk. It says The flamingo basks in light. what?? 🤔",
                "sprite": [
                    {
                        "for": "searchable",
                        "img": "/assets/img/appartment/desksearchable.png"
                    },
                    {
                        "for": "unsearchable",
                        "img": "/assets/img/appartment/deskunsearchable.png"
                    }
                ]
            },
            {
                "name": "Cabinet",
                "room": "Kitchen",
                "pos": {
                    "x": 27,
                    "y": 2
                },
                "state": "searchable",
                "in_use": true,
                "reward":"knife",
                "search_msg":"Omg a knife 🔪... ill take it but there's no way i'm fighting that thing u can't make me ok?? ",
                "sprite": [
                    {
                        "for": "searchable",
                        "img": "/assets/img/appartment/cabinetsearchable.png"
                    },
                    {
                        "for": "unsearchable",
                        "img": "/assets/img/appartment/cabinetunsearchable.png"
                    }
                ]
            },
            {
                "name": "Fridge",
                "room": "kitchen",
                "pos": {
                    "x": 27,
                    "y": 4
                },
                "state": "unsearchable",
                "in_use": false,
                "search_msg":"there's some creepy ouija shit on your fridge with the fridge magnets. They spell out VENES. is that something i should know about??",
                "sprite": [
                    {
                        "for": "searchable",
                        "img": "/assets/img/appartment/fridgesearchable.png"
                    },
                    {
                        "for": "unsearchable",
                        "img": "/assets/img/appartment/fridgeunsearchable.png"
                    }
                ]
            },
            {
                "name": "Stove",
                "room": "kitchen",
                "pos": {
                    "x": 29,
                    "y": 3
                },
                "state": "unsearchable",
                "in_use": false,
                "search_msg":"U left some olive oil here on the stove for some reason... I feel like it might be useful for something... 🫕",
              
                "sprite": [
                    {
                        "for": "searchable",
                        "img": "/assets/img/appartment/stovesearchable.png"
                    },
                    {
                        "for": "unsearchable",
                        "img": "/assets/img/appartment/stoveunsearchable.png"
                    }
                ]
            },{
                "name":"Storage Shade",
                "room":"Storage",
                "wall_pos": {
                    "x": 6,
                    "y": 3
                },
                "stop_pos":{
                    "x": 7,
                    "y": 3
                },
                "state":"locked",
                "in_use": false,
                "locked_message":"No no no theres no way im going in there its dark as shit and its already fking scary out here ",
                "unlocked_message":"Ok here goes...",
                "sprite": [
                    {
                        "for": "locked",
                        "img": "/assets/img/appartment/storagelocked.png"
                    },
                    {
                        "for": "unlocked",
                        "img": "/assets/img/appartment/storageunlocked.png"
                    }
                ]
            },{
                "name":"The Exit",
                "room":"Main Hallway",
                "in_use": true,

                "pos":{
                    "x": 14,
                    "y": 19
                },
                "state":"locked",
                "locked_message":"Omg I can't get out, I need a key... there's a note here that says REMINDER: CHECK STORAGE. shit.",
                "unlocked_message":"IM OUT, AND THIS RELATIONSHIP IS OVER",
                "sprite": [
                    {
                        "for": "locked",
                        "img": "/assets/img/appartment/theexit.png"
                    }
                ]
            }
            
        ]
    ;
}
