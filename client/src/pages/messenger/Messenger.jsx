import React, { useContext, useEffect, useRef, useState } from 'react';
import './messenger.css';
import '../../components/leftbar/leftbar.css';
import Leftbar from '../../components/leftbar/Leftbar';
import Conversation from '../../components/conversation/Conversation';
import Message from '../../components/message/Message';
import { AuthContext } from '../../context/AuthContext';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
// import axios from 'axios';
import axiosInstance from '../../axiosInstance';
import io from 'socket.io-client';
import Searchchat from '../../components/searchchat/Searchchat';
import Loadingline from '../../components/loadingline/Loadingline';
import { Link } from 'react-router-dom';

const Messenger = () => {
    const { user } = useContext(AuthContext);
    const [conversations, setConversations] = useState([]);
    const [currConversation, setCurrConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const [showSearch, setShowSearch] = useState(false);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(true);


    const scrollRef = useRef();
    const socket = useRef();
    const searchRef = useRef(); 

    const PF = process.env.REACT_APP_PUBLIC_FLDER;

    useEffect(() => {
        socket.current = io('https://snapverse-proj-api.onrender.com', { transports: ['websocket'] });

        socket.current.on("getMessage", data => {
            setArrivalMessage(data);
        });
    }, []);

    useEffect(() => {
        if (arrivalMessage && arrivalMessage.sender && currConversation) {
            const isSenderMember = currConversation.members.some(member => member._id === arrivalMessage.sender._id);

            if (isSenderMember) {
                setMessages(prev => [...prev, arrivalMessage]);
            }
        }
    }, [arrivalMessage, currConversation]);

    useEffect(() => {
        socket.current.emit("addUser", user._id);
    }, [user]);


    useEffect(() => {
        const getConversations = async () => {
            try {
                setLoading(true)
                const res = await axiosInstance.get('/conversations/' + user._id);
                setConversations(res.data);
                setLoading(false)
            } catch (e) {
                console.log(e);
                setLoading(false)
            }
        };
        getConversations();
    }, [user._id]);

    useEffect(() => {
        const getMessages = async () => {
            try {
                const res = await axiosInstance.get('/messages/' + currConversation?._id);
                setMessages(res.data);
            } catch (e) {
                console.log(e);
            }
        };
        getMessages();
    }, [currConversation]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSearch(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleSend = async (e) => {
        e.preventDefault();
        const receiver = getChatBoxUser();

        socket.current.emit("sendMessage", {
            conversationId: currConversation._id,
            senderId: user._id,
            receiverId: receiver._id,
            text: newMessage,
        });

        socket.current.on("newMessage", (newMessage) => {
            setMessages([...messages, newMessage]);
            setNewMessage("");
        });
    };

    const getChatBoxUser = () => {
        const otherUser = currConversation.members.find(member => member._id !== user._id);
        return otherUser;
    };

    const handleConversationClick = (c) => {
        setCurrConversation(c);
        setShowSearch(false); //
    };

    const handleInputChange = (value) => {
        setInput(value);
        if (value.trim() !== "") {
            setShowSearch(true);
        } else {
            setShowSearch(false);
        }
    };

    return (
        <>
            {loading && <Loadingline/>}
            <Leftbar />
            <div className='messenger'>
                <div className="chatMenu">
                    <div className="chatMenuWrapper">
                        <div className="chatMenuInputArea">
                            <input 
                                placeholder='Search for friends...' 
                                className='chatMenuInput' 
                                value={input}
                                onChange={(e) => handleInputChange(e.target.value)}
                            />
                            {showSearch && (
                                <div ref={searchRef}>
                                    <Searchchat 
                                        conversations={conversations} 
                                        setConversations={setConversations} 
                                        setCurrConversation={setCurrConversation} 
                                        currentUser={user} 
                                        input={input} 
                                        setInput={setInput} 
                                        onClose={() => setShowSearch(false)} 
                                    />
                                </div>
                                
                            )}
                        </div>     
                        <span className="messengesTitle">Messages</span>
                        {conversations.map((c) => (
                            <div key={c._id} onClick={() => handleConversationClick(c)} className={currConversation?._id === c._id ? "activeConversation" : ""}>
                                <Conversation key={c._id} conversation={c} currentUser={user} />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="chatBox">
                    <div className={currConversation ? "chatBoxWrapper" : "chatBoxWrapper noCurrConversationWrap"}>
                        {currConversation ? (
                            <>
                                <div className="chatBoxTop">
                                    <Link to={`/profile/${getChatBoxUser().username}`} style={{ textDecoration: "none", color: "inherit" }}>
                                        <img src={getChatBoxUser()?.profileImg ? getChatBoxUser()?.profileImg : `${PF}person/R.png`} alt="" className="chatBoxUserImg" />
                                    </Link>
                                    <Link to={`/profile/${getChatBoxUser().username}`} style={{ textDecoration: "none", color: "inherit" }}>
                                        <span className="chatBoxUsername">{getChatBoxUser().username}</span>
                                    </Link>
                                </div>
                                <div className="chatBoxMiddle">
                                    {messages.map((m) => (
                                        <div key={m._id} ref={scrollRef}>
                                            <Message message={m} own={m.sender._id === user._id} />
                                        </div>
                                    ))}
                                </div>
                                <div className="chatBoxBottom">
                                    <textarea
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        value={newMessage}
                                        placeholder='Message...'
                                        name="" id=""
                                        className="chatMessageInput"
                                    />
                                    <span className="chatSendButton" onClick={handleSend}>Send</span>
                                </div>
                            </>
                        ) : (
                            <div className="noCurrConversation">
                                <ChatBubbleOutlineOutlinedIcon style={{ fontSize: "100px" }} />
                                <span className='noCurrConversationTitle'>Your Messages</span>
                                <span className='noCurrConversationText'>Send a message to start a chat.</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Messenger;