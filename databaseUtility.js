const Story = require('./models/story')
const User = require('./models/user')
const Review = require('./models/review')

async function clearDatabase(){
    await Story.deleteMany()
    await User.deleteMany()
    await Review.deleteMany()
    console.log('Cleared the database')
}

async function loadDatabase(){
    let datas = [
        {
            "name": "Ironman",
            "email": "ironman@example.com",
            "password": "ironman123",
            "about": `
                Hey there, fellow adventurers! The name's Tony Stark, but you probably know me better as Ironman. 
                I'm not your average superhero - I'm a genius, billionaire, playboy, and philanthropist, with a knack for saving the world in style. 
                Stark Industries isn't just your run-of-the-mill tech company - it's at the forefront of innovation, pushing the boundaries of what's possible. 
                And as the man behind the suit, I've seen my fair share of ups and downs. 
                But through it all, I've remained committed to one thing: making the world a safer place for everyone. 
                So buckle up, because you're about to embark on an electrifying journey through the life and times of Ironman!
            `,
            "story": {
                "title": "Ironman's Epic Adventures",
                "desc": `
                    Welcome, one and all, to the thrilling saga of Ironman! 
                    It all started with a bang - literally - when I was captured by terrorists and forced to build a weapon of mass destruction. 
                    But instead, I crafted an advanced suit of armor to escape. 
                    From that moment on, I've been using my newfound identity to fight against evil and protect the innocent.
                `,
                "content": `
                    Sit back, relax, and get ready for an epic tale unlike any other. 
                    My journey as Ironman has been filled with twists, turns, and larger-than-life adventures that will leave you on the edge of your seat. 
                    From the streets of New York City to the far reaches of outer space, there's no limit to the lengths I'll go to in order to protect the innocent and uphold justice. 
                    But being a hero isn't just about fighting villains and saving the day - it's also about the sacrifices we make and the friendships we forge along the way. 
                    So join me as I recount some of my most memorable moments as Ironman, from the heart-stopping battles to the quiet moments of reflection. 
                    And who knows? You might just learn a thing or two about what it means to be a true hero in a world filled with chaos and danger.
                    
                    It all started with a single suit of armor - a suit that would change the course of history and pave the way for a new era of heroism. 
                    But as the years went by, that suit evolved into something more than just a piece of technology - it became a symbol of hope, strength, and resilience in the face of adversity. 
                    And with each new challenge I faced, that suit grew stronger, more advanced, and more indispensable than ever before. 
                    But no matter how powerful the suit may be, it's nothing without the man inside - the man who refuses to back down in the face of danger, 
                    the man who will stop at nothing to protect the people he cares about, the man who will always be known as Ironman.
                `
            }
        },
        {
            "name": "Einstein",
            "email": "einstein@example.com",
            "password": "einstein123",
            "about": `
                Greetings, curious minds! My name is Albert Einstein, and I've dedicated my life to unraveling the mysteries of the universe. 
                Born in 1879 in the Kingdom of Württemberg, Germany, I've always been fascinated by the workings of the cosmos. 
                Through years of rigorous study and groundbreaking research, I've developed revolutionary theories that have reshaped our understanding of space, time, and energy. 
                From the famous equation E=mc² to the theory of general relativity, my work has left an indelible mark on the field of physics and inspired generations of scientists to explore the unknown. 
                But my contributions extend beyond the realm of academia - I'm also a passionate advocate for peace, human rights, and scientific progress. 
                So join me as we embark on a journey through the wonders of the universe and the power of human intellect!
            `,
            "story": {
                "title": "Einstein's Quest for Knowledge",
                "desc": `
                    Welcome to the extraordinary tale of Albert Einstein! 
                    From humble beginnings to global acclaim, Einstein's life is a testament to the boundless potential of the human mind. 
                    Join us as we explore the pivotal moments and groundbreaking discoveries that have shaped the course of modern physics and transformed our understanding of the cosmos.
                `,
                "content": `
                    Prepare to be amazed as we delve into the depths of Einstein's brilliance. 
                    From his early years as a struggling student to his rise as one of the most influential scientists of all time, Einstein's journey is nothing short of remarkable. 
                    But his story is more than just a series of academic achievements - it's a testament to the power of perseverance, curiosity, and imagination. 
                    So join us as we unravel the mysteries of the universe and uncover the secrets of Einstein's genius.
                    
                    Born into a world on the brink of technological revolution, Einstein's insatiable curiosity and relentless pursuit of knowledge would propel him to greatness. 
                    From his groundbreaking work on the photoelectric effect to his development of the theory of general relativity, Einstein's contributions to science are unparalleled. 
                    But his impact extends far beyond the realm of academia - Einstein's ideas have reshaped our understanding of the universe and laid the foundation for countless technological advancements. 
                    So join us as we celebrate the life and legacy of one of history's greatest minds - Albert Einstein.
                `
            }
        },
        {
            "name": "Spiderman",
            "email": "spiderman@example.com",
            "password": "spiderman123",
            "about": `
                Hey there, web-slingers! The name's Peter Parker, but you probably know me better as Spiderman. 
                I may not be your friendly neighborhood superhero – I'm just your average high school student with a knack for sticking to walls and fighting crime. 
                But when I'm not juggling schoolwork and superhero duties, I'm swinging through the streets of New York City, keeping the city safe from villains and ne'er-do-wells. 
                So whether you're a fan of my web-slinging antics or just looking for some excitement, buckle up and get ready for an adventure like no other!
            `,
            "story": {
                "title": "Spiderman's Amazing Adventures",
                "desc": `
                    Welcome to the spectacular world of Spiderman! 
                    From the bustling streets of Queens to the towering skyscrapers of Manhattan, Spiderman's adventures are as thrilling as they are action-packed. 
                    Join us as we swing through the city, battling villains and saving the day with our trusty web-shooters and quick wit.
                `,
                "content": `
                    Get ready for some high-flying, web-slinging action as we dive into Spiderman's greatest adventures. 
                    From epic battles with the Green Goblin to heart-stopping rescues atop the Brooklyn Bridge, Spiderman's heroics know no bounds. 
                    But being a superhero isn't all fun and games – it comes with its fair share of challenges and sacrifices. 
                    So join us as we explore the highs and lows of life as Spiderman, and discover what it truly means to be a hero.
                    
                    Born into a world of chaos and uncertainty, Peter Parker never imagined he'd become the legendary Spiderman. 
                    But after being bitten by a radioactive spider, Peter's life was changed forever. 
                    With great power comes great responsibility, and Peter quickly learned that being a hero meant putting others before himself. 
                    So join us as we follow Spiderman on his quest to protect the innocent and uphold justice in a world filled with danger and intrigue.
                `
            }
        },
        {
            "name": "Hulk",
            "email": "hulk@example.com",
            "password": "hulk123",
            "about": `
                Smash! Hulk strongest one there is! Hulk may be big and green, but Hulk not mean. 
                Hulk just misunderstood. When Hulk not smashing, Hulk likes to read and enjoy quiet time in nature. 
                But when there's trouble, Hulk always ready to lend a helping hand, or smash it! 
                So get ready for some smashing adventures with the one and only Hulk!
            `,
            "story": {
                "title": "The Incredible Hulk's Rampage",
                "desc": `
                    Welcome to the world of the Incredible Hulk! 
                    From his humble beginnings as scientist Bruce Banner to his transformation into the unstoppable green behemoth, Hulk's story is as tragic as it is thrilling. 
                    Join us as we explore the depths of Hulk's rage and the boundless power that lies within.
                `,
                "content": `
                    Brace yourselves for some earth-shattering action as we delve into Hulk's most epic battles. 
                    From clashes with the Abomination to showdowns with the military, Hulk's strength knows no bounds. 
                    But beneath the surface, there's more to Hulk than meets the eye. 
                    Join us as we unravel the mysteries of Hulk's past and discover what truly makes him the strongest one there is.
                    
                    Born out of a gamma radiation experiment gone wrong, Bruce Banner's life was forever changed when he was transformed into the Incredible Hulk. 
                    With his alter ego threatening to consume him, Bruce struggles to control the beast within. 
                    But despite the chaos and destruction that follows in his wake, Hulk remains a hero at heart, always fighting for what's right. 
                    So join us as we witness the incredible journey of the Hulk, from monster to savior, and everything in between.
                `
            }
        },
        {
            "name": "Ben Tennyson",
            "email": "ben@example.com",
            "password": "ben123",
            "about": `
                Hey there, fellow adventurers! The name's Ben Tennyson, and I'm just your average teenager with an extraordinary secret. 
                With the help of my trusty Omnitrix, I can transform into all sorts of amazing alien heroes and save the day. 
                But being a hero isn't always easy – there are villains to defeat, mysteries to solve, and homework to finish. 
                So join me as I embark on a whirlwind adventure through the cosmos and beyond!
            `,
            "story": {
                "title": "Ben 10's Intergalactic Adventures",
                "desc": `
                    Welcome to the universe of Ben 10! 
                    From battling evil aliens to thwarting world-conquering plots, Ben's adventures are out of this world. 
                    Join us as we journey through the cosmos, exploring strange new worlds and uncovering the secrets of the Omnitrix.
                `,
                "content": `
                    Get ready for some action-packed excitement as we dive into Ben's most epic escapades. 
                    From facing off against the evil Vilgax to teaming up with cosmic heroes, Ben's bravery knows no bounds. 
                    But being a hero isn't just about fighting bad guys – it's also about friendship, courage, and doing what's right. 
                    So join us as we follow Ben on his quest to protect the universe from the forces of darkness.
                    
                    It all started one fateful summer when Ben stumbled upon a mysterious alien device known as the Omnitrix. 
                    With its power, Ben can transform into countless alien forms, each with its own unique abilities. 
                    But as Ben soon discovers, being a hero means more than just having superpowers – it means using them to help others and stand up for what's right. 
                    So join us as we witness the incredible journey of Ben 10, from ordinary kid to intergalactic hero.
                `
            }
        }
    ]
    for(data of datas.reverse()){
        const userResponse = await User.createUser(data.name, data.about, data.email, data.password)
        if(userResponse.created){
            const storyResponse = await Story.createStory(data.story.title, data.story.desc, data.story.content, userResponse.id)
            if(storyResponse.created){
                // await User.addStory(author, storyResponse.id)
                const userResponse2 = await User.addStory(userResponse.id, storyResponse.id)
                if(!userResponse2.added){
                    console.log("Failed to add story to user" , userResponse2.message)
                    const storyDeleteResponse = await Story.deleteStory(storyResponse.id)
                    if(!storyDeleteResponse.deleted){
                        console.log("unused story is present in database, id: " + storyResponse.id)
                        console.log(storyDeleteResponse)
                    }
                }
            }
            else{
                console.log("Failed to create story" , storyResponse.message)
            }
        }
        else{
            console.log("Failed to create user" , userResponse.message)
        }
    }
    console.log('Loaded the database')
}

module.exports = {
    clearDatabase,
    loadDatabase
}