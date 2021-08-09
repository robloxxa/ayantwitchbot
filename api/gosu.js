const axios = require('axios')
const path = require('path')
module.exports = async client => {
    const portList = [client.config.gosuPort, 20727, 24050]
    const self = {
        data: async () => {
            try {
                let data
                for (let i of portList) {
                    data = await axios.get(`http://localhost:${i}/json`)
                        .then(res => res.data)
                        .catch(() => false)
                    if (data) break
                }
                if (!data) throw 'No response from gosumemory or streamcompanion'
                if (data.error) throw client.interface.gosu.osu_error
                if (data.osuIsRunning !== undefined) return self.convertSCkeys(data)
                return data
            } catch (e) {
                client.logger.error('(gosumemory) '+e)
                return false
            }
        },
        convertSCkeys: (data) => {
            if (!data.osuIsRunning) return false
            const convertGrade = (grade) => {
                switch (grade) {
                    case 0: return 'XH'
                    case 1: return 'H'
                    case 2: return 'SS'
                    case 3: return 'S'
                    case 4: return 'A'
                    case 5: return 'B'
                    case 6: return 'C'
                    case 7: return 'D'
                    default: return ''
                }
            }
            const settings = {
                showInterface: data.ingameInterfaceIsEnabled,
                folders: {
                    game: path.normalize(data.skinPath + '\\..\\..'),
                    skin: data.skin,
                    songs: path.normalize(data.osuFileLocation + '\\..\\..')
                }
            }
            const menu = {
                mainMenu: null,
                state: data.rawStatus,
                gameMode: data.gameMode,
                isChatEnabled: data.chatIsEnabled,
                bm: {
                    time: {
                        firstObj: data.firstHitObjectTime,
                        current: data.time * 1000,
                        full: data.totaltime
                    },
                    id: data.mapid,
                    set: data.mapsetid,
                    md5: data.md5,
                    rankedStatus: data.rankedStatus,
                    metadata: {
                        artist: data.artistRoman,
                        title: data.titleRoman,
                        mapper: data.creator,
                        difficulty: data.diffName
                    },
                    stats: {
                        AR: data.mAR,
                        CS: data.mCS,
                        OD: data.mOD,
                        HP: data.mHP,
                        SR: data.liveStarRating,
                        BPM: {
                            min: data.mMinBpm,
                            max: data.mMaxBpm
                        },
                        maxCombo: data.maxCombo,
                        fullSR: data.mStars,
                        memoryAR: data.ar,
                        memoryCS: data.cs,
                        memoryOD: data.od,
                        memoryHP: data.hp
                    },
                    path: {
                        folder: path.normalize(data.osuFileLocation + '\\..').split("\\").pop(),
                        file: data.osuFileName,
                        bg: data.backgroundImageFileName,
                        audio: data.mp3Name,
                        full: null
                    }
                },
                mods: {
                    num: data.modsEnum,
                    str: data.mods.replace(/None|,/g, '')
                },
                pp: {
                    100: data.osu_SSPP,
                    99: data.osu_99PP,
                    98: data.osu_98PP,
                    97: data.osu_97PP,
                    96: data.osu_96PP,
                    95: data.osu_95PP,
                }
            }
            const gameplay = {
                gameMode: 0,
                name: data.username,
                score: data.score,
                accuracy: data.acc,
                combo: {
                    current: data.combo,
                    max: data.currentMaxCombo
                },
                hp: {
                    normal: data.playerHp,
                    smooth: data.playerHp
                },
                hits: {
                    300: data.c300,
                    geki: data.geki,
                    100: data.c100,
                    katu: data.katsu,
                    50: data.c50,
                    0: data.miss,
                    sliderBreaks: data.sliderBreaks,
                    grade: {
                        current: convertGrade(data.grade),
                        maxThisPlay: convertGrade(data.grade)
                    },
                    unstableRate: data.unstableRate,
                    hitErrorArray: null
                },
                pp: {
                    current: data.ppIfMapEndsNow,
                    fc: data.ppIfRestFced,
                    maxThisPlay: data.noChokePp
                },
                keyOverlay: {},
                leaderboard: {}
            }
            return { settings, menu, gameplay }
        }
    }
    if (await self.data()) client.logger.ready(client.interface.gosu.ready)
    return self
}
