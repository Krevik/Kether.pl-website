import { useEffect, useRef, useState } from 'react';
import styles from './Fireflies.module.css';

function useInterval(callback: () => void, delay: number | null) {
    const savedCallback = useRef(callback);

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        if (delay === null) return;
        const id = setInterval(() => savedCallback.current(), delay);
        return () => clearInterval(id);
    }, [delay]);
}

type FireflyType = {
    id: number;
    posX: number;
    posY: number;
    motionX: number;
    motionY: number;
    speed: number;
    lifetime: number;
    maxLifetime: number;
    markedForRemoval: boolean;
};
const MAX_FIREFLIES = 10;

export type FirefliesProps = {
    containerWidth: number;
    containerHeight: number;
};
export const Firefly = (props: FirefliesProps) => {
    const generateUniqueId = () => {
        return new Date().valueOf();
    };

    function randomInt(min: number, max: number) {
        // min and max included
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    const createNewFirefly = () => {
        const firefly: FireflyType = {
            id: generateUniqueId(),
            posX: randomInt(0, props.containerWidth),
            posY: randomInt(0, props.containerHeight),
            motionX: Math.random() - Math.random(),
            motionY: Math.random() - Math.random(),
            speed: Math.random() * 10 - Math.random() * 10,
            lifetime: 0,
            maxLifetime: 5 * Math.random(),
            markedForRemoval: false,
        };
        return firefly;
    };

    const [firefly, setFirefly] = useState<FireflyType>(createNewFirefly());

    useInterval(() => {
        let updatedFirefly = { ...firefly };
        //position
        const posX = firefly.posX + firefly.motionX * firefly.speed;
        const posY = firefly.posY + firefly.motionY * firefly.speed;
        updatedFirefly.posX = posX;
        updatedFirefly.posY = posY;
        //age
        updatedFirefly.lifetime += 0.001;
        if (updatedFirefly.lifetime > updatedFirefly.maxLifetime) {
            updatedFirefly = createNewFirefly();
        }
        //boundings
        if (
            updatedFirefly.posX > props.containerWidth ||
            updatedFirefly.posY > props.containerHeight ||
            updatedFirefly.posY < -100 ||
            updatedFirefly.posX < -100
        ) {
            updatedFirefly = createNewFirefly();
        }
        setFirefly(updatedFirefly);
    }, 10);

    return (
        <div
            className={styles.firefly}
            key={JSON.stringify(firefly)}
            style={{
                marginTop: `${firefly.posY}px`,
                marginRight: `${firefly.posX}px`,
            }}
        />
    );
};
