import Animated, { Easing, withSpring } from "react-native-reanimated";

const AnimatedIcon = Animated.createAnimatedComponent(IconButton);

const AnimatedHeart = ({ liked, onPress }) => {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withSpring(liked ? 1.5 : 1, {
      damping: 10,
      stiffness: 100,
    });
  }, [liked]);

  return (
    <AnimatedIcon
      style={[styles.icon, { transform: [{ scale: scale.value }] }]}
      icon={liked ? "heart" : "heart-outline"}
      mode="contained"
      onPress={onPress}
    />
  );
};

