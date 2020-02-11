const axios = require('axios');
const Dev = require('../models/Dev')
const mongoose = require('mongoose')
const parseStringAsArray = require('../utils/parseStringAsArray')

// Index (lista), show (Único), store (Criar), update (Alterar), destroy (Deletar)

module.exports = {
    //Index
    async index(request, response) {
        const devs = await Dev.find();
        return response.json(devs)
    },
    //
    //store
    async store(request, response) {
        const { github_username, techs, latitude, longitude } = request.body;

        let dev = await Dev.findOne({ github_username });

        let err = 'Usuário já existente.';

        if (!dev) {
            err = 'Usuário criado com sucesso.';

            try {
                const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`)
                let { name, avatar_url, bio } = apiResponse.data;

                const techsArray = parseStringAsArray(techs)

                const location = {
                    type: 'Point',
                    coordinates: [longitude, latitude]
                }

                if (name == null) {
                    name = apiResponse.data.login;
                }

                if (bio == null) {
                    bio = 'User without bio!';
                }

                var deve = await Dev.create({
                    github_username,
                    name,
                    avatar_url,
                    bio,
                    techs: techsArray,
                    location
                })
            } catch (error) {
                err = 'Usuário não possui conta no Github'
            }
        }
        return response.json(err)
    },

    //destroy
    async delete(request, response) {
        console.log(request.params)
        const { github_username } = request.params;

        await Dev.deleteOne({
            github_username: github_username
        })

        return response.json({ "message": "User deleted" })
    },
    //update
    async update(request, response) {
        const { avatar_url, bio, latitude, longitude, techs } = request.body;
        const { github_username } = request.params;
        const location = {
            type: 'Point',
            coordinates: [longitude, latitude]
        }

        let dev = await Dev.findOne({ github_username });

        if (!dev) {
            response.json({
                "message": "User do not exists!"
            })
        } else {
            await Dev.updateOne({
                "github_username": github_username,
            }, {
                $set: {
                    avatar_url: avatar_url === null ? dev.github_username : avatar_url,
                    bio: bio === null ? dev.bio : bio,
                    location,
                    techs: parseStringAsArray(techs)

                }
            })
            response.json({
                "message": "User Updated"
            })
        }
    }
};