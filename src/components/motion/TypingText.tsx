import { useEffect, useMemo, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

interface TypingTextProps {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'span';
  speed?: number;
  start?: boolean;
  onDone?: () => void;
}

const TYPING_DURATION_MS = 720;

export function TypingText({ text, className, as: Tag = 'h1', speed, start = true, onDone }: TypingTextProps) {
  const reduceMotion = useReducedMotion();
  const initialCount = reduceMotion ? text.length : 0;
  const [typingState, setTypingState] = useState({ text, count: initialCount });
  const characters = useMemo(() => Array.from(text), [text]);
  const typingDelay = speed ?? Math.max(8, Math.round(TYPING_DURATION_MS / Math.max(characters.length, 1)));
  const onDoneRef = useRef(onDone);
  const completedRef = useRef(false);

  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    completedRef.current = false;
    if (!start) {
      return undefined;
    }

    if (reduceMotion) {
      completedRef.current = true;
      window.setTimeout(() => onDoneRef.current?.(), 0);
      return undefined;
    }

    let index = 0;
    const timer = window.setInterval(() => {
      index += 1;
      setTypingState({ text, count: index });
      if (index >= characters.length) {
        window.clearInterval(timer);
        if (!completedRef.current) {
          completedRef.current = true;
          window.setTimeout(() => onDoneRef.current?.(), 45);
        }
      }
    }, typingDelay);

    return () => window.clearInterval(timer);
  }, [characters.length, reduceMotion, start, text, typingDelay]);

  const count = reduceMotion ? characters.length : typingState.text === text ? typingState.count : 0;
  const done = count >= characters.length;

  return (
    <Tag className={`${className ?? ''} typing-text`.trim()} aria-label={text}>
      <span className="typing-text-placeholder" aria-hidden="true">{text}</span>
      <span className="typing-text-live" aria-hidden="true">
        {characters.slice(0, count).join('')}
        {!reduceMotion && <span className={done ? 'typing-cursor done' : 'typing-cursor'} />}
      </span>
    </Tag>
  );
}
