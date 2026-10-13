import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Alert
} from 'react-native';

interface WordItem {
  word: string;
  question: string;
  hint: string;
  emoji: string;
  scrambled: string[];
}

interface LevelData {
  title: string;
  badge: string;
  words: WordItem[];
}

const LEVELS: Record<number, LevelData> = {
  1: {
    title: "Level 1: 3-Letter Words",
    badge: "3 Letters",
    words: [
      {
        word: "BEE",
        question: "A buzzing little insect that makes sweet honey.",
        hint: "B _ E",
        emoji: "🐝",
        scrambled: ["B", "E", "E", "O", "T", "S"]
      },
      {
        word: "SUN",
        question: "The warm yellow star in the sky that lights up daytime.",
        hint: "S _ N",
        emoji: "☀️",
        scrambled: ["S", "U", "N", "M", "P", "A"]
      },
      {
        word: "CAT",
        question: "A friendly furry pet that purrs and says meow.",
        hint: "C _ T",
        emoji: "🐱",
        scrambled: ["C", "A", "T", "O", "G", "R"]
      }
    ]
  },
  2: {
    title: "Level 2: 4-Letter Daily Words",
    badge: "4 Letters",
    words: [
      {
        word: "FEET",
        question: "The parts at the end of your legs that you walk and run on.",
        hint: "F _ _ T",
        emoji: "👣",
        scrambled: ["F", "E", "E", "T", "O", "P", "S"]
      },
      {
        word: "KNEE",
        question: "The middle joint in your leg that bends when you jump or sit.",
        hint: "K _ _ E",
        emoji: "🦵",
        scrambled: ["K", "N", "E", "E", "L", "R", "B"]
      },
      {
        word: "STAR",
        question: "A bright glowing point of light in the night sky.",
        hint: "S _ _ R",
        emoji: "⭐",
        scrambled: ["S", "T", "A", "R", "O", "M", "E"]
      },
      {
        word: "FROG",
        question: "A green animal that hops on lily pads and catches insects.",
        hint: "F _ _ G",
        emoji: "🐸",
        scrambled: ["F", "R", "O", "G", "L", "K", "T"]
      }
    ]
  },
  3: {
    title: "Level 3: 5-Letter Smart Words",
    badge: "5 Letters",
    words: [
      {
        word: "BRAIN",
        question: "The amazing thinking organ inside your head that remembers everything!",
        hint: "B _ _ _ N",
        emoji: "🧠",
        scrambled: ["B", "R", "A", "I", "N", "O", "S", "T"]
      },
      {
        word: "SMILE",
        question: "A happy expression on your face when you show your teeth and laugh!",
        hint: "S _ _ _ E",
        emoji: "😊",
        scrambled: ["S", "M", "I", "L", "E", "A", "T", "P"]
      },
      {
        word: "HONEY",
        question: "Sweet golden syrup made by bees from flower nectar.",
        hint: "H _ _ _ Y",
        emoji: "🍯",
        scrambled: ["H", "O", "N", "E", "Y", "P", "B", "T"]
      },
      {
        word: "QUEEN",
        question: "The ruler bee of the colony who wears a little gold crown.",
        hint: "Q _ _ _ N",
        emoji: "👑",
        scrambled: ["Q", "U", "E", "E", "N", "K", "L", "S"]
      }
    ]
  },
  4: {
    title: "Level 4: 6-Letter Words",
    badge: "6 Letters",
    words: [
      {
        word: "FAMILY",
        question: "The people at home who love and take care of you every day.",
        hint: "F _ _ _ _ Y",
        emoji: "👨‍👩‍👧",
        scrambled: ["F", "A", "M", "I", "L", "Y", "E", "R", "O"]
      },
      {
        word: "FLOWER",
        question: "A colorful blossom with fragrant petals that bees love.",
        hint: "F _ _ _ _ R",
        emoji: "🌸",
        scrambled: ["F", "L", "O", "W", "E", "R", "D", "M", "S"]
      },
      {
        word: "GARDEN",
        question: "A green yard where lovely plants, fruits, and flowers grow.",
        hint: "G _ _ _ _ N",
        emoji: "🏡",
        scrambled: ["G", "A", "R", "D", "E", "N", "P", "L", "T"]
      },
      {
        word: "PENCIL",
        question: "A wooden tool with graphite lead used by kids to write neatly.",
        hint: "P _ _ _ _ L",
        emoji: "✏️",
        scrambled: ["P", "E", "N", "C", "I", "L", "A", "O", "R"]
      }
    ]
  },
  5: {
    title: "Level 5: 7+ Letter Champions",
    badge: "7+ Letters",
    words: [
      {
        word: "TWINKLE",
        question: "To shine with a sparkling light, like a little diamond in the sky!",
        hint: "T _ _ _ _ _ E",
        emoji: "✨",
        scrambled: ["T", "W", "I", "N", "K", "L", "E", "S", "A", "R"]
      },
      {
        word: "BUTTERFLY",
        question: "A gorgeous winged insect that used to be a little caterpillar.",
        hint: "B _ _ _ _ _ _ _ Y",
        emoji: "🦋",
        scrambled: ["B", "U", "T", "T", "E", "R", "F", "L", "Y", "A", "O"]
      },
      {
        word: "CHAMPION",
        question: "The winner of the spelling bee contest who gets a sparkling gold trophy!",
        hint: "C _ _ _ _ _ _ N",
        emoji: "🏆",
        scrambled: ["C", "H", "A", "M", "P", "I", "O", "N", "S", "T"]
      }
    ]
  }
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'home' | 'arena' | 'trophy'>('home');
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [wordIndex, setWordIndex] = useState(0);
  const [typedInput, setTypedInput] = useState('');
  const [score, setScore] = useState(350);

  const levelData = LEVELS[selectedLevel];
  const currentQ = levelData.words[wordIndex];

  const handleStartLevel = (lvl: number) => {
    setSelectedLevel(lvl);
    setWordIndex(0);
    setTypedInput('');
    setCurrentScreen('arena');
  };

  const handleType = (val: string) => {
    const clean = val.toUpperCase().replace(/[^A-Z]/g, '').slice(0, currentQ.word.length);
    setTypedInput(clean);
  };

  const handleTilePress = (char: string) => {
    if (typedInput.length < currentQ.word.length) {
      setTypedInput(typedInput + char);
    }
  };

  const handleClear = () => {
    setTypedInput('');
  };

  const handleCheckWord = () => {
    if (!typedInput.trim()) {
      Alert.alert("⚠️ Write Word", "Please write or tap letters to spell the word.");
      return;
    }

    if (typedInput === currentQ.word) {
      setScore(prev => prev + 50);
      Alert.alert(
        "🎉 Great Job!",
        `You spelled "${currentQ.word}" correctly! (+50 Stars)`,
        [
          {
            text: "Next Word →",
            onPress: () => {
              setTypedInput('');
              if (wordIndex < levelData.words.length - 1) {
                setWordIndex(wordIndex + 1);
              } else {
                if (selectedLevel < 5) {
                  Alert.alert("🏆 Level Complete!", `Unlocking Level ${selectedLevel + 1}!`);
                  handleStartLevel(selectedLevel + 1);
                } else {
                  setCurrentScreen('trophy');
                }
              }
            }
          }
        ]
      );
    } else {
      Alert.alert("❌ Try Again", `Hint: ${currentQ.hint}`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FBF9F1" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.mascotBadge}>
            <Text style={{ fontSize: 20 }}>🐝</Text>
          </View>
          <View>
            <Text style={styles.appTitle}>SpellBee Champ</Text>
            <Text style={styles.appSubtitle}>Classes 1–3 • Pune CBSE</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.counterBadge}>
            <Text style={{ fontSize: 13 }}>⭐</Text>
            <Text style={styles.counterText}>{score}</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 90 }}>
        {/* SCREEN 1: LEVEL SELECTOR */}
        {currentScreen === 'home' && (
          <View style={styles.screenContainer}>
            <View style={styles.heroCard}>
              <Text style={styles.heroTitle}>Select Your Spelling Level 🐝</Text>
              <Text style={styles.heroSubtitle}>Learn daily words from 3 letters to 7+ letters!</Text>
            </View>

            {([1, 2, 3, 4, 5] as (1 | 2 | 3 | 4 | 5)[]).map((lvl) => {
              const info = LEVELS[lvl];
              return (
                <Pressable key={lvl} style={styles.levelCard} onPress={() => handleStartLevel(lvl)}>
                  <View style={styles.levelLeft}>
                    <Text style={{ fontSize: 28 }}>{info.words[0].emoji}</Text>
                    <View>
                      <Text style={styles.levelTitle}>{info.title}</Text>
                      <Text style={styles.levelSample}>
                        {info.words.map(w => w.word).join(' • ')}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.playTag}>Play ➔</Text>
                </Pressable>
              );
            })}
          </View>
        )}

        {/* SCREEN 2: PLAYING QUIZ */}
        {currentScreen === 'arena' && (
          <View style={styles.screenContainer}>
            <View style={styles.topBar}>
              <Pressable onPress={() => setCurrentScreen('home')} style={styles.backBtn}>
                <Text style={styles.backBtnText}>←</Text>
              </Pressable>
              <View style={styles.pillBadge}>
                <Text style={styles.pillBadgeText}>Level {selectedLevel} • Word {wordIndex + 1}/{levelData.words.length}</Text>
              </View>
            </View>

            <View style={styles.whiteCard}>
              <Text style={styles.stepTagBlue}>Step 1 • Clue</Text>
              <Text style={styles.questionText}>"{currentQ.question}"</Text>

              <Text style={styles.stepTagAmber}>Step 2 • Picture Clue</Text>
              <View style={styles.pictureContainer}>
                <Text style={{ fontSize: 50 }}>{currentQ.emoji}</Text>
                <Text style={styles.pictureCaption}>{currentQ.word} Clue</Text>
              </View>

              <View style={styles.guessBox}>
                <View>
                  <Text style={styles.stepTagGreen}>Step 3 • Guess Word</Text>
                  <Text style={styles.guessHintText}>{currentQ.hint}</Text>
                </View>
                <View style={styles.lengthTag}>
                  <Text style={styles.lengthTagText}>{currentQ.word.length} Letters</Text>
                </View>
              </View>

              <Text style={styles.stepTagOrange}>Step 4 • Write or Type Word</Text>
              <TextInput
                value={typedInput}
                onChangeText={handleType}
                placeholder="TYPE SPELLING HERE..."
                placeholderTextColor="#9CA3AF"
                autoCapitalize="characters"
                style={styles.textInput}
              />

              <View style={styles.slotsRow}>
                {Array.from({ length: currentQ.word.length }).map((_, i) => {
                  const char = typedInput[i];
                  return (
                    <View key={i} style={[styles.slot, char ? styles.slotFilled : styles.slotEmpty]}>
                      <Text style={styles.slotText}>{char || ''}</Text>
                    </View>
                  );
                })}
              </View>
            </View>

            <View style={styles.letterBank}>
              {currentQ.scrambled.map((char, idx) => (
                <Pressable key={idx} style={styles.letterTile} onPress={() => handleTilePress(char)}>
                  <Text style={styles.letterTileText}>{char}</Text>
                </Pressable>
              ))}
            </View>

            <View style={styles.actionRow}>
              <Pressable style={styles.clearBtn} onPress={handleClear}>
                <Text style={styles.clearBtnText}>Clear ⌫</Text>
              </Pressable>
              <Pressable style={styles.tactileBtnMint} onPress={handleCheckWord}>
                <Text style={styles.btnText}>Check Word ✓</Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* SCREEN 3: TROPHY */}
        {currentScreen === 'trophy' && (
          <View style={styles.screenContainer}>
            <Text style={styles.pageTitle}>🏆 Mastered Vocabulary</Text>
            <View style={styles.whiteCard}>
              <Text style={styles.cardHeader}>Daily Words Mastered:</Text>
              <View style={styles.wordTagList}>
                {['BEE', 'SUN', 'FEET', 'KNEE', 'STAR', 'BRAIN', 'SMILE', 'FAMILY', 'FLOWER', 'TWINKLE', 'CHAMPION'].map((w, idx) => (
                  <View key={idx} style={styles.wordTag}>
                    <Text style={styles.wordTagText}>{w} ✓</Text>
                  </View>
                ))}
              </View>
              <Pressable style={styles.tactileBtnPrimary} onPress={() => setCurrentScreen('home')}>
                <Text style={styles.btnText}>Back to Levels ➔</Text>
              </Pressable>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Navigation */}
      <View style={styles.bottomNav}>
        <Pressable style={styles.navItem} onPress={() => setCurrentScreen('home')}>
          <Text style={{ fontSize: 20 }}>🏠</Text>
          <Text style={[styles.navText, currentScreen === 'home' && styles.navTextActive]}>Levels</Text>
        </Pressable>
        <Pressable style={styles.navItem} onPress={() => setCurrentScreen('arena')}>
          <Text style={{ fontSize: 20 }}>🐝</Text>
          <Text style={[styles.navText, currentScreen === 'arena' && styles.navTextActive]}>Quiz</Text>
        </Pressable>
        <Pressable style={styles.navItem} onPress={() => setCurrentScreen('trophy')}>
          <Text style={{ fontSize: 20 }}>🏆</Text>
          <Text style={[styles.navText, currentScreen === 'trophy' && styles.navTextActive]}>Locker</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FBF9F1' },
  header: { height: 62, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#DAC2AE40' },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  mascotBadge: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#FF9F1C', alignItems: 'center', justifyContent: 'center' },
  appTitle: { fontSize: 16, fontWeight: '700', color: '#895100' },
  appSubtitle: { fontSize: 10, fontWeight: '600', color: '#544434' },
  headerRight: { flexDirection: 'row', gap: 8 },
  counterBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#FFFFFF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 16, borderWidth: 1, borderColor: '#DAC2AE60' },
  counterText: { fontSize: 12, fontWeight: '700', color: '#683C00' },
  content: { flex: 1, padding: 14 },
  screenContainer: { gap: 12 },
  heroCard: { backgroundColor: '#FFDCBC', borderRadius: 20, padding: 16 },
  heroTitle: { fontSize: 18, fontWeight: '700', color: '#1B1C17' },
  heroSubtitle: { fontSize: 12, color: '#544434', marginTop: 4 },
  levelCard: { backgroundColor: '#FFFFFF', borderRadius: 18, padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: '#DAC2AE60' },
  levelLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  levelTitle: { fontSize: 13, fontWeight: '700', color: '#1B1C17' },
  levelSample: { fontSize: 10, color: '#6B7280', marginTop: 2 },
  playTag: { fontSize: 12, fontWeight: '700', color: '#D97706', backgroundColor: '#FEF3C7', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  backBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#DAC2AE60' },
  backBtnText: { fontSize: 16, fontWeight: '700' },
  pillBadge: { backgroundColor: '#FEF3C7', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 16 },
  pillBadgeText: { fontSize: 11, fontWeight: '700', color: '#92400E' },
  whiteCard: { backgroundColor: '#FFFFFF', borderRadius: 22, padding: 14, borderWidth: 1, borderColor: '#DAC2AE60', gap: 8 },
  stepTagBlue: { fontSize: 9, fontWeight: '700', color: '#3A86FF', textTransform: 'uppercase' },
  stepTagAmber: { fontSize: 9, fontWeight: '700', color: '#D97706', textTransform: 'uppercase', marginTop: 4 },
  stepTagGreen: { fontSize: 9, fontWeight: '700', color: '#059669', textTransform: 'uppercase' },
  stepTagOrange: { fontSize: 9, fontWeight: '700', color: '#EA580C', textTransform: 'uppercase', marginTop: 4 },
  questionText: { fontSize: 13, fontWeight: '700', color: '#1B1C17' },
  pictureContainer: { height: 100, backgroundColor: '#FBF9F1', borderRadius: 14, borderWidth: 2, borderColor: '#DAC2AE', borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center' },
  pictureCaption: { fontSize: 10, fontWeight: '600', color: '#6B7280', marginTop: 2 },
  guessBox: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFFBEB', padding: 8, borderRadius: 12 },
  guessHintText: { fontSize: 16, fontWeight: '700', color: '#895100', letterSpacing: 2 },
  lengthTag: { backgroundColor: '#FFFFFF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  lengthTagText: { fontSize: 10, fontWeight: '700', color: '#895100' },
  textInput: { backgroundColor: '#FBF9F1', borderWidth: 2, borderColor: '#FF9F1C', borderRadius: 12, paddingVertical: 8, paddingHorizontal: 10, fontSize: 16, fontWeight: '700', color: '#895100', textAlign: 'center', letterSpacing: 2 },
  slotsRow: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginVertical: 4 },
  slot: { width: 32, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  slotEmpty: { backgroundColor: '#F0EEE6', borderWidth: 2, borderStyle: 'dashed', borderColor: '#DAC2AE' },
  slotFilled: { backgroundColor: '#FFFFFF', borderWidth: 2, borderColor: '#FF9F1C' },
  slotText: { fontSize: 16, fontWeight: '700', color: '#895100' },
  letterBank: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginVertical: 6 },
  letterTile: { width: 38, height: 38, borderRadius: 12, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#DAC2AE80', alignItems: 'center', justifyContent: 'center', elevation: 2 },
  letterTileText: { fontSize: 15, fontWeight: '700', color: '#1B1C17' },
  actionRow: { flexDirection: 'row', gap: 10 },
  clearBtn: { flex: 1, backgroundColor: '#FFFFFF', paddingVertical: 12, borderRadius: 14, alignItems: 'center', borderWidth: 1, borderColor: '#DAC2AE60' },
  clearBtnText: { fontSize: 13, fontWeight: '700', color: '#E11D48' },
  tactileBtnMint: { flex: 2, backgroundColor: '#06D6A0', paddingVertical: 12, borderRadius: 14, alignItems: 'center' },
  tactileBtnPrimary: { backgroundColor: '#FF9F1C', paddingVertical: 12, borderRadius: 14, alignItems: 'center', marginTop: 10 },
  btnText: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },
  pageTitle: { fontSize: 18, fontWeight: '700', color: '#895100' },
  cardHeader: { fontSize: 13, fontWeight: '700', color: '#1B1C17', marginBottom: 8 },
  wordTagList: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  wordTag: { backgroundColor: '#ECFDF5', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10, borderWidth: 1, borderColor: '#A7F3D0' },
  wordTagText: { fontSize: 11, fontWeight: '700', color: '#065F46' },
  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 60, backgroundColor: '#FFFFFF', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#DAC2AE40' },
  navItem: { alignItems: 'center' },
  navText: { fontSize: 10, color: '#9CA3AF' },
  navTextActive: { color: '#895100', fontWeight: '700' }
});
