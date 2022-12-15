import { Router } from 'express';
import knex from './db';
import { createAccessToken, getUserIdFromAccessToken, hash } from './utils';
import cookie from 'cookie';
import { isUsernameTaken } from './db_helpers';

const router = Router();

router.get('/', async (req, res) => {
    const results = await knex('users').select('*');
    res.json({ msg: 'Hello man!' });
});

router.post('/signUp', async (req, res) => {
    const { username, password, displayedName } = req.body;
    const salt = hash(Date.now().toString());
    const hashedPassword = hash(password + salt);

    const usernameTaken = await isUsernameTaken(username.trim());
    if (usernameTaken) {
        res.status(406).json({
            error: 'This username is not available'
        });
        return;
    }

    const userId = (await knex('users').insert({
        username,
        fullName: displayedName,
        password: hashedPassword,
        salt
    }))[0];
    const access_token = await createAccessToken(userId);
    res.cookie('access_token', access_token);
    res.json({
        data: {
            access_token,
            userId
        }
    });
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const matchedUsers = await knex('users').where({ username: username }).select('username', 'password', 'salt', 'userId');
    if (matchedUsers.length) {
        const user = matchedUsers[0];
        const testPassword = hash(password + user.salt);
        if (testPassword === user.password) {
            const token = await createAccessToken(user.userId);
            res.cookie('access_token', token);
            res.json({
                data: {
                    access_token: token,
                    userId: user.userId
                }
            });
        } else {
            res.status(403).json({
                error: 'Invalid username or password'
            });
        }
    } else {
        res.status(403).json({
            error: 'Invalid username or password'
        });
    }
});

router.use(async (req, res, next) => {
    const cookies = cookie.parse(req.headers.cookie || '');
    const userId = await getUserIdFromAccessToken(cookies.access_token);
    if (!userId) {
        res.clearCookie('access_token');
        res.status(403).json({
            error: 'Provided access_token is invalid'
        });
    } else {
        (req as any).userId = userId;
        next();
    }
});

router.get('/history', async (req, res) => {
    const currentUserId = (req as any).userId;
    const chats = await knex('chat_participants').where({ userId: currentUserId })
        .innerJoin('chats', 'chat_participants.chatId', 'chats.chatId')
        .select('chat_participants.chatId', 'chats.createdAt', 'chats.chatName');
    await Promise.all(chats.map(async (chat) => {
        chat.messages = await knex('messages').where({ chatId: chat.chatId }).orderBy('createdAt');
        chat.participants = (await knex('chat_participants').where({ chatId: chat.chatId }).select('userId')).map(p => p.userId);
        if (!chat.chatName) {
            // 1-1 chat
            chat.chatName = (await knex('chat_participants')
                .where({ chatId: chat.chatId })
                .whereNot('chat_participants.userId', currentUserId)
                .innerJoin('users', 'chat_participants.userId', 'users.userId')
                .select('users.fullName')
                .limit(1))[0].fullName;
        }
    }));
    res.json(chats);
});

export default router;