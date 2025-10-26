import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import { Button } from '@/components/ui/button';
import FallbackNotice from '@/components/FallbackNotice';
import { ChatService, supabase, CHAT_ENABLED, dmRoomId } from '@/lib/supabaseClient';
import { shortAddr } from '@/lib/addr';

export default function DirectChat() {
  const { peer } = useParams();
  const navigate = useNavigate();
  const [me, setMe] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const listRef = useRef(null);
  const subRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    try {
      if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
    } catch (e) {}
  }, []);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      if (!CHAT_ENABLED || !supabase) return;

      const addr = await ChatService.getCurrentAddress();
      if (!mounted) return;
      setMe(addr);

      if (!addr) return;

      if (!peer || !ethers.utils.isAddress(peer)) return;

      const rid = dmRoomId(addr, peer);
      setRoomId(rid);

      // fetch last 200 messages (ascending by created_at)
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('room_id', rid)
          .order('created_at', { ascending: true })
          .limit(200);

        if (error) {
          console.error('Failed to load messages', error);
        } else {
          setMessages(data || []);
          setTimeout(scrollToBottom, 50);
        }
      } catch (e) {
        console.error(e);
      }

      // subscribe to realtime inserts for this room
      try {
        subRef.current = supabase
          .channel(`messages:${rid}`)
          .on(
            'postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'messages', filter: `room_id=eq.${rid}` },
            (payload) => {
              setMessages((m) => [...m, payload.new]);
              setTimeout(scrollToBottom, 20);
            }
          )
          .subscribe();
      } catch (e) {
        console.error('Failed to subscribe to messages', e);
      }
    };

    init();

    return () => {
      mounted = false;
      try {
        if (subRef.current && subRef.current.unsubscribe) subRef.current.unsubscribe();
      } catch (e) {}
    };
  }, [peer, scrollToBottom]);

  const send = async () => {
    if (!CHAT_ENABLED || !supabase) return;
    if (!roomId) return;
    if (!text || !text.trim()) return;

    try {
      const sender = me || (await ChatService.getCurrentAddress());
      const { error } = await supabase.from('messages').insert({ room_id: roomId, sender, text: text.trim() });
      if (error) {
        console.error('Send failed', error);
      } else {
        setText('');
      }
    } catch (e) {
      console.error('Send error', e);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  if (!CHAT_ENABLED || !supabase) {
    return (
      <div className="min-h-screen bg-[#0B1220] flex items-center justify-center">
        <FallbackNotice title="Chat Disabled" details="Chat is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY." />
      </div>
    );
  }

  if (!me) {
    return (
      <div className="min-h-screen bg-[#0B1220] flex items-center justify-center">
        <FallbackNotice title="Connect Wallet" details="Please connect your wallet to use direct messages." />
      </div>
    );
  }

  if (!peer || !ethers.utils.isAddress(peer)) {
    return (
      <div className="min-h-screen bg-[#0B1220] flex items-center justify-center">
        <FallbackNotice title="Invalid Peer" details="The peer address is invalid." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B1220] p-6">
      <div className="max-w-3xl mx-auto bg-transparent h-[80vh] flex flex-col border border-gray-700 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          <div>
            <div className="text-white font-semibold">Chat with {shortAddr(peer)}</div>
            <div className="text-gray-400 text-sm">You: {shortAddr(me)}</div>
          </div>
          <div>
            <Button onClick={() => navigate('/chat')}>Back</Button>
          </div>
        </div>

        <div ref={listRef} className="flex-1 p-4 overflow-auto space-y-3 bg-[#06101a]">
          {messages.map((m) => (
            <div key={m.id} className={`p-2 rounded ${String(m.sender).toLowerCase() === String(me).toLowerCase() ? 'bg-blue-600 text-white self-end' : 'bg-gray-800 text-gray-100 self-start'}`}>
              <div className="text-xs text-gray-300">{shortAddr(m.sender)}</div>
              <div className="mt-1 whitespace-pre-wrap">{m.text}</div>
            </div>
          ))}
        </div>

        <div className="p-3 border-t border-gray-700">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={onKeyDown}
            className="w-full p-2 bg-[#07121a] text-white rounded resize-none h-24"
            placeholder="Type a message... (Enter to send, Shift+Enter for newline)"
            disabled={!CHAT_ENABLED}
          />
          <div className="mt-2 flex justify-end">
            <Button onClick={send} disabled={!CHAT_ENABLED || !text.trim()}>Send</Button>
          </div>
        </div>
      </div>
    </div>
  );
}