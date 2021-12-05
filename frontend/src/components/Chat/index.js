/* eslint-disable jsx-a11y/anchor-is-valid */
import { AutoComplete, notification } from 'antd';
import { useEffect, useRef, useState } from 'react';
import useDebounce from '../../Hooks/useDebounce';
import axios from 'axios';
import './style.css';
import { connect } from 'react-redux';
import { getRooms, setRoom } from '../../redux/actions/room';
import moment from '../../../node_modules/moment';
import { BsDot } from 'react-icons/bs';

const Chat = ({
  _id,
  name,
  socket,
  activeUsers,
  getRooms,
  setRoom,
  rooms,
  room,
}) => {
  const ref = useRef();
  const roomRef = useRef(room);
  const [active, setActive] = useState(Object.values(activeUsers));

  const [searchUser, setSearchUser] = useState('');
  const [options, setOptions] = useState([]);
  const [messages, setMessages] = useState([]);
  const [member, setMember] = useState('');
  const [currentMessage, setCurrentMessage] = useState('');
  console.log({ messages });

  const getRoom = (value, option) => {
    socket.emit('set_room', [_id, value]);
    setSearchUser(option.label);
  };

  const getMessages = async () => {
    try {
      const res = await axios.get(`/api/chat/${room._id}`);
      const { data } = res;
      setMessages(data);
    } catch (err) {
      console.log({ err });
    }
  };

  const searchUsers = async () => {
    if (searchUser) {
      try {
        const res = await axios.get(`/api/users/all/${searchUser}`);
        const { data } = res;
        setOptions(data.map(({ name, _id }) => ({ label: name, value: _id })));
      } catch (err) {
        console.log({ err });
      }
    } else {
      setOptions([]);
    }
  };

  useDebounce(() => searchUsers(), 1200, [searchUser]);
  useEffect(() => {
    getRooms();
    return () => {
      setRoom(undefined);
    };
  }, []);

  useEffect(() => {
    if (room) {
      const member = room?.members?.find(({ _id: id }) => _id !== id)?.name;
      console.log({ member });
      setMember(member);
      getMessages();
    }

    return () => {};
  }, [room, _id]);

  useEffect(() => {
    setTimeout(() => {
      intoView();
    }, 1000);
    return () => {};
  }, [messages]);

  useEffect(() => {
    roomRef.current = room;
  }, [room, roomRef, socket]);

  useEffect(() => {
    socket?.on('receive_message', (data) => {
      console.log({ room, data });
      if (data?.room?._id === roomRef?.current?._id) {
        setMessages((list) => [...list, data]);
      }
    });
  }, []);

  useEffect(() => {
    setActive(Object.values(activeUsers));
    return () => {};
  }, [activeUsers]);

  const sendMessage = async () => {
    if (currentMessage !== '') {
      const messageData = {
        author: _id,
        message: currentMessage,
        room: room?._id,
      };
      await socket.emit('send_message', messageData);
      setMessages((list) => [
        ...list,
        {
          ...messageData,
          author: { _id, name },
          _id: Date.now(),
          date: Date.now(),
        },
      ]);
      setCurrentMessage('');
      intoView();
    }
  };
  const intoView = () =>
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  return (
    <main className='content w-100 p-0 m-0'>
      <div className='container p-0 m-0 w-100'>
        <div className='card m-0 p-0 w-100'>
          <div className='row g-0 w-100 p-0 m-0'>
            <div className='col-12 col-lg-5 col-xl-3 border-end'>
              <div className='px-4 d-none d-md-block'>
                <div className='d-flex align-items-center'>
                  <div className='flex-grow-1'>
                    {/* <input
                      type='text'
                      className='form-control my-3'
                      placeholder='Search...'
                    /> */}
                    <AutoComplete
                      backfill={true}
                      onSelect={getRoom}
                      onChange={setSearchUser}
                      value={searchUser}
                      allowClear
                      size='large'
                      className='w-100 rounded my-3'
                      options={options}
                      placeholder='Search users...'
                      // filterOption={(inputValue, option) =>
                      //   option.value
                      //     .toUpperCase()
                      //     .indexOf(inputValue.toUpperCase()) !== -1
                      // }
                    />
                  </div>
                </div>
              </div>
              {rooms.map(({ _id: roomId, members }) => (
                <a
                  key={roomId}
                  onClick={() => {
                    const member = members.find(({ _id: id }) => _id !== id);
                    setRoom({ _id: roomId, members });
                    setMember(member?.name);
                    socket.emit('set_room', [_id, member?._id]);
                  }}
                  href='#'
                  className={`list-group-item list-group-item-action border-0 ${
                    roomId === room?._id ? 'active' : ''
                  }`}
                >
                  {/* <div className='badge bg-success float-end'>5</div> */}
                  <div className='d-flex align-items-start'>
                    <img
                      src='https://bootdey.com/img/Content/avatar/avatar5.png'
                      className='rounded-circle me-1'
                      alt='Vanessa Tucker'
                      width='40'
                      height='40'
                    />
                    <div className='flex-grow-1 ms-3'>
                      {members.find(({ _id: id }) => _id !== id)?.name}
                      <div className='small'>
                        <span className='fas fa-circle chat-offline'></span>
                        <BsDot
                          size={26}
                          className='align-self-center'
                          color={
                            active?.includes(
                              members.find(({ _id: id }) => _id !== id)?._id
                            )
                              ? 'green'
                              : 'red'
                          }
                        />
                        {active?.includes(
                          members.find(({ _id: id }) => _id !== id)?._id
                        )
                          ? 'Online'
                          : 'Offline'}
                      </div>
                    </div>
                  </div>
                </a>
              ))}

              <hr className='d-block d-lg-none mt-1 mb-0' />
            </div>
            <div className='col-12 col-lg-7 col-xl-9'>
              <div className='py-2 px-4 border-bottom d-none d-lg-block'>
                <div className='d-flex align-items-center py-1'>
                  <div className='position-relative'>
                    <img
                      src='https://bootdey.com/img/Content/avatar/avatar3.png'
                      className='rounded-circle me-1'
                      alt='Sharon Lessman'
                      width='40'
                      height='40'
                    />
                  </div>
                  <div className='flex-grow-1 ps-3'>
                    <strong>{member}</strong>
                    {/* <div className='text-muted small'>
                      <em>Typing...</em>
                    </div> */}
                  </div>
                  <div>
                    <button className='btn btn-primary btn-lg me-1 px-3'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='24'
                        height='24'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        stroke-width='2'
                        stroke-linecap='round'
                        stroke-linejoin='round'
                        className='feather feather-phone feather-lg'
                      >
                        <path d='M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z'></path>
                      </svg>
                    </button>
                    <button className='btn btn-info btn-lg me-1 px-3 d-none d-md-inline-block'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='24'
                        height='24'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        stroke-width='2'
                        stroke-linecap='round'
                        stroke-linejoin='round'
                        className='feather feather-video feather-lg'
                      >
                        <polygon points='23 7 16 12 23 17 23 7'></polygon>
                        <rect
                          x='1'
                          y='5'
                          width='15'
                          height='14'
                          rx='2'
                          ry='2'
                        ></rect>
                      </svg>
                    </button>
                    <button className='btn btn-light border btn-lg px-3'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='24'
                        height='24'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        stroke-width='2'
                        stroke-linecap='round'
                        stroke-linejoin='round'
                        className='feather feather-more-horizontal feather-lg'
                      >
                        <circle cx='12' cy='12' r='1'></circle>
                        <circle cx='19' cy='12' r='1'></circle>
                        <circle cx='5' cy='12' r='1'></circle>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <div className='position-relative'>
                <div className='chat-messages p-4'>
                  {messages.map(({ _id: messageId, author, message, date }) => (
                    <div
                      key={messageId}
                      className={`chat-message-${
                        author?._id === _id ? 'right' : 'left'
                      } ${author?._id === _id ? 'm' : 'p'}b-4`}
                    >
                      <div>
                        <img
                          src='https://bootdey.com/img/Content/avatar/avatar1.png'
                          className='rounded-circle me-1'
                          alt='Chris Wood'
                          width='40'
                          height='40'
                        />
                      </div>
                      <div>
                        <div className='min-width flex-shrink-1 text-break bg-light rounded py-2 px-3 me-3'>
                          <div className='fw-bold mb-1'>
                            {author?._id === _id ? 'You' : member}
                          </div>
                          {message}
                        </div>
                        <div className='text-muted small float-end text-nowrap mt-1 me-3'>
                          {moment(date).format('DD-MMM hh:mm')}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={ref} className='w-100 p-0 m-0'></div>
                </div>
              </div>

              <div className='flex-grow-0 py-3 px-4 border-top'>
                <div className='input-group'>
                  <input
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    value={currentMessage}
                    type='text'
                    className='form-control'
                    placeholder='Type your message'
                  />
                  <button onClick={sendMessage} className='btn btn-primary'>
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

const mapStateToProps = ({
  user: {
    user: { _id, name },
  },
  io: { socket, activeUsers },
  room: { list: rooms, room },
}) => ({
  socket,
  activeUsers,
  _id,
  name,
  rooms,
  room,
});

export default connect(mapStateToProps, { getRooms, setRoom })(Chat);
