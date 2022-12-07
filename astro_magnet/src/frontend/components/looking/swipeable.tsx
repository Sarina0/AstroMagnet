import { useState } from 'react';
import type { User } from "@app/shared/interfaces/user";
import {
  Dimensions,
  Animated,
  PanResponder,
} from 'react-native';
import Card from './card';
import ActionButton from "./actionBtn";

interface Props {
    item: User;
    removeCard?: () => void;
    swipedDirection: (direction: string) => void;
}

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function SwipeableCard({ item, removeCard, swipedDirection }: Props) {
  const [xPosition, setXPosition] = useState(new Animated.Value(0));
  let swipeDirection = '';
  let cardOpacity = new Animated.Value(1);
  let likeOpacity = new Animated.Value(-SCREEN_WIDTH);
  let dislikeOpacity = new Animated.Value(-SCREEN_WIDTH);
  
  let rotateCard = xPosition.interpolate({
    inputRange: [-200, 0, 200],
    outputRange: ['-20deg', '0deg', '20deg'],
  });

  let panResponder = PanResponder.create({
    onStartShouldSetPanResponder: (evt, gestureState) => false,
    onMoveShouldSetPanResponder: (evt, gestureState) => true,
    onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
    onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
    onPanResponderMove: (evt, gestureState) => {
      xPosition.setValue(gestureState.dx);
      if (gestureState.dx > SCREEN_WIDTH - 250) {
        swipeDirection = 'right';
        Animated.parallel([Animated.timing(likeOpacity, {
            toValue: 3,
            duration: 50,
            useNativeDriver: false,
        }),
        Animated.timing(dislikeOpacity, {
            toValue: -SCREEN_WIDTH,
            duration: 50,
            useNativeDriver: false,
        })]).start();
      } else if (gestureState.dx < -SCREEN_WIDTH + 250) {
        swipeDirection = 'left';
        Animated.parallel([
        Animated.timing(likeOpacity, {
            toValue: -SCREEN_WIDTH,
            duration: 30,
            useNativeDriver: false,
        }),
        Animated.timing(dislikeOpacity, {
            toValue: 3,
            duration: 30,
            useNativeDriver: false,
        })]).start();
      }
    },
    onPanResponderRelease: (evt, gestureState) => {
      if (
        gestureState.dx < SCREEN_WIDTH - 150 &&
        gestureState.dx > -SCREEN_WIDTH + 150
      ) {
        swipedDirection('--');
        Animated.parallel([
          Animated.spring(xPosition, {
          toValue: 0,
          speed: 5,
          bounciness: 10,
          useNativeDriver: false,
        }),
        Animated.timing(likeOpacity, {
            toValue: -SCREEN_WIDTH,
            duration: 20,
            useNativeDriver: false,
        }),
        Animated.timing(dislikeOpacity, {
            toValue: -SCREEN_WIDTH,
            duration: 20,
            useNativeDriver: false,
        })
        ]).start();
      } else if (gestureState.dx > SCREEN_WIDTH - 150) {
        Animated.parallel([
            Animated.timing(xPosition, {
                toValue: SCREEN_WIDTH,
                duration: 150,
                useNativeDriver: false,
            }),
            Animated.timing(cardOpacity, {
                toValue: 0,
                duration: 150,
                useNativeDriver: false,
            }),
        ]).start(() => {
          swipedDirection(swipeDirection);
          removeCard && removeCard();
        });
      } else if (gestureState.dx < -SCREEN_WIDTH + 150) {
        Animated.parallel([
            Animated.timing(xPosition, {
                toValue: -SCREEN_WIDTH,
                duration: 200,
                useNativeDriver: false,
            }),
            Animated.timing(cardOpacity, {
                toValue: 0,
                duration: 200,
                useNativeDriver: false,
            }),
        ]).start(() => {
          swipedDirection(swipeDirection);
          removeCard && removeCard();
        });
      }
    },
  });

  if (!item) return null;

  return (
        <>
            <ActionButton
                style={{
                    right: likeOpacity
                }}
                variant="like"
            />
        
            <ActionButton
                style={{
                    left: dislikeOpacity
                }}
                variant="dislike"
            />
            <Animated.View
                {...panResponder.panHandlers}
                style={{
                    backgroundColor: "transparent",
                    opacity: cardOpacity,
                    transform: [{ translateX: xPosition }, { rotate: rotateCard }],
                    width: "100%",
                    height: "100%",
                    flex: 1,
                    position: "absolute",
                    }}
            >
                <Card item={item} />
        </Animated.View>
    </>
  );
};
