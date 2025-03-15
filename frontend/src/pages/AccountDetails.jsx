import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Heading,
  Input,
  Button,
  IconButton,
  useColorMode,
  useColorModeValue,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  Alert,
  AlertIcon,
  AlertDescription,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Progress,
  Text,
} from "@chakra-ui/react";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";
import { motion, AnimatePresence } from "framer-motion";

const primaryColorLight = '#c6001e';
const primaryColorDark = '#cf2640';
const primaryHoverLight = '#b0001a';
const primaryHoverDark = '#d83a52';
const primaryActiveLight = '#970016';
const primaryActiveDark = '#e14f64';

const AccountDetails = () => {
  // For development only
  const BACKEND_URL = `${window.location.protocol}//${window.location.hostname}:5001`;

  // For production
  // const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  
  const primaryColor = useColorModeValue(primaryColorLight, primaryColorDark);
  const hoverColor = useColorModeValue(primaryHoverLight, primaryHoverDark);
  const activeColor = useColorModeValue(primaryActiveLight, primaryActiveDark);

  const { colorMode, toggleColorMode } = useColorMode();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [alert, setAlert] = useState(null);
  const [emailValid, setEmailValid] = useState(true);
  const [passwordValid, setPasswordValid] = useState(true);
  const [confirmPasswordValid, setConfirmPasswordValid] = useState(true);
  const [oldPasswordValid, setOldPasswordValid] = useState(true);
  const [originalName, setOriginalName] = useState("");
  const [originalEmail, setOriginalEmail] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [confirmPasswordStrength, setConfirmPasswordStrength] = useState(0);

  const cardBg = useColorModeValue("white", "gray.700");

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const resetAlert = () => {
    setTimeout(() => {
      setAlert(null);
    }, 3000);
  };
  
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BACKEND_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setName(data.username);
        setEmail(data.email);
        setOriginalName(data.username);
        setOriginalEmail(data.email);
      }
    };

    fetchProfile();
  }, []);

  const checkIfProfileChanged = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BACKEND_URL}/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    if (response.ok) {
      setOriginalName(data.username);
      setOriginalEmail(data.email);
      return data.username === name && data.email === email;
    }
    return false;
  };

  const handleSaveChanges = async () => {
    if (!validateEmail(email)) {
      setAlert({ type: "error", message: "Invalid email format." });
      setEmailValid(false);
      return;
    }

    const isUnchanged = await checkIfProfileChanged();
    if (isUnchanged) {
      setAlert({
        type: "info",
        message:
          "Name and email are not updated because they are the same as the current values.",
      });
      resetAlert();
      return;
    }

    const token = localStorage.getItem("token");
    const response = await fetch(`${BACKEND_URL}/account-update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, email }),
    });
    if (response.ok) {
      setAlert({ type: "success", message: "Profile updated successfully." });
    } else {
      setAlert({ type: "error", message: "Failed to update profile." });
    }
    resetAlert();
  };

  const handleResetPassword = async () => {
    if (!oldPassword && !newPassword && !confirmPassword) {
      setAlert({
        type: "error",
        message: "Please fill in all the password fields.",
      });
      resetAlert();
      return;
    }

    if (newPassword === oldPassword) {
      setAlert({
        type: "error",
        message: "The new password cannot be the same as the current password.",
      });
      resetAlert();
      return;
    }

    if (newPassword !== confirmPassword) {
      setAlert({ type: "error", message: "Passwords do not match." });
      resetAlert();
      setPasswordValid(false);
      setConfirmPasswordValid(false);
      return;
    } else {
      setPasswordValid(true);
      setConfirmPasswordValid(true);
    }

    const token = localStorage.getItem("token");
    const response = await fetch(`${BACKEND_URL}/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ oldPassword, newPassword }),
    });

    if (response.ok) {
      setAlert({ type: "success", message: "Password reset successfully." });
      resetAlert();

      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordStrength(0);
      setConfirmPasswordStrength(0);
      setPasswordValid(true);
      setOldPasswordValid(true);
  
    } else {
      setAlert({
        type: "error",
        message: "Incorrect current password. Please try again.",
      });
      resetAlert();
      setOldPasswordValid(false);
    }
  };

  const handleDeleteAccount = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BACKEND_URL}/delete-account`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.ok) {
      setAlert({ type: "success", message: "Account deleted successfully." });
      resetAlert();
      localStorage.clear();
      window.location.href = "/";
    } else {
      setAlert({ type: "error", message: "Failed to delete account." });
    }
  };

  const evaluatePasswordStrength = (password) => {
    let score = 0;
    if (password.length >= 6) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    setPasswordStrength(score);
  };
  
  const evaluateConfirmPasswordStrength = (password) => {
    let score = 0;
    if (password.length >= 6) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    setConfirmPasswordStrength(score);
  };
   
  useEffect(() => {
    evaluatePasswordStrength(newPassword);
  }, [newPassword]);

  const getPasswordStrengthLabel = (score) => {
    switch (score) {
      case 1:
        return "Weak";
      case 2:
        return "Fair";
      case 3:
        return "Good";
      case 4:
        return "Strong";
      case 5:
        return "Very Strong";
      default:
        return "Too Short";
    }
  };

  const getTextColor = (score) => {
    const green = useColorModeValue("green.600", "green.300");
    const orange = useColorModeValue("orange.600", "orange.300");
    const gray = useColorModeValue("gray.600", "gray.300");
    const red = useColorModeValue("red.600", "red.300");
  
    if (score <= 1) return red;
    if (score === 2) return orange;
    if (score === 3) return orange;
    if (score === 4) return green;
    if (score === 5) return green;
    return gray;
  };
  
  return (
    <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.5 }}
    >
        <Box px={{ md: 4 }} py={{ md: 6 }}>
        <Flex direction="column" bg={cardBg} p={8} borderRadius="md" shadow="md">
            <Flex justify="space-between" align="center" mb="4">
            <Heading fontSize={{ base: "3xl", md: "4xl" }}>Account Details</Heading>
            <HStack spacing="4" display={{ base: "none", lg: "flex" }}>
                <IconButton
                aria-label="Toggle theme"
                icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
                onClick={toggleColorMode}
                />
            </HStack>
            </Flex>
            <Box borderBottom="1px" borderColor="gray.300" mb="4"></Box>
            <motion.div
                initial={{ height: 0 }}
                animate={{ height: alert ? "auto" : 0 }}
                exit={{ height: 0 }}
                transition={{ duration: 0.3 }}
                style={{ overflow: "hidden" }}
                >
                <AnimatePresence>
                    {alert && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                        <Alert status={alert.type} mb={4}>
                        <AlertIcon />
                        <AlertDescription>{alert.message}</AlertDescription>
                        </Alert>
                    </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
            <VStack spacing="4" align="stretch">
              <Flex
                  direction={{ base: "column", lg: "row" }}
                  gap="4"
                  alignItems={{ base: "flex-start", lg: "center" }}
              >
                  <FormControl>
                  <FormLabel>Name</FormLabel>
                  <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                  />
                  </FormControl>
                  <FormControl isInvalid={!emailValid}>
                  <FormLabel>Email</FormLabel>
                  <Input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={() => setEmailValid(validateEmail(email))}
                      placeholder="Enter your email"
                  />
                  </FormControl>
              </Flex>
              <Flex
                direction={{ base: "column", lg: "row" }}
                gap="4"
                alignItems="flex-start"
                width="100%"
                >
                <FormControl isInvalid={!oldPasswordValid} flex="1">
                    <FormLabel>Old Password</FormLabel>
                    <Input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    />
                </FormControl>
                <FormControl isInvalid={!passwordValid} flex="1">
                    <FormLabel>New Password</FormLabel>
                    <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => {
                        setNewPassword(e.target.value);
                        evaluatePasswordStrength(e.target.value);
                    }}
                    />
                    <Progress
                    value={(passwordStrength / 5) * 100}
                    size="xs"
                    colorScheme={
                        passwordStrength < 3
                        ? "red"
                        : passwordStrength < 4
                        ? "yellow"
                        : "green"
                    }
                    mt="2"
                    />
                    <Text
                    mt="1"
                    fontSize="sm"
                    color={getTextColor(passwordStrength)}
                    >
                    {getPasswordStrengthLabel(passwordStrength)}
                    </Text>
                </FormControl>
                <FormControl isInvalid={!confirmPasswordValid || !passwordValid} flex="1">
                    <FormLabel>Confirm Password</FormLabel>
                    <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        evaluateConfirmPasswordStrength(e.target.value);
                    }}
                    />
                    <Progress
                    value={(confirmPasswordStrength / 5) * 100}
                    size="xs"
                    colorScheme={
                        confirmPasswordStrength < 3
                        ? "red"
                        : confirmPasswordStrength < 4
                        ? "yellow"
                        : "green"
                    }
                    mt="2"
                    />
                    <Text
                    mt="1"
                    fontSize="sm"
                    color={getTextColor(confirmPasswordStrength)}
                    >
                    {getPasswordStrengthLabel(confirmPasswordStrength)}
                    </Text>
                </FormControl>
              </Flex>
              <HStack spacing={{ base: "2", md: "4" }} mt="4" justify={{ base: "center", md: "center" }} flexWrap="wrap">
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button
                      bg={primaryColor}
                      color="white"
                      onClick={handleSaveChanges}
                      _hover={{ bg: hoverColor }}
                      _active={{ bg: activeColor }}
                    >
                    Save Changes
                    </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button
                      bg={primaryColor}
                      color="white"
                      onClick={handleResetPassword}
                      _hover={{ bg: hoverColor }}
                      _active={{ bg: activeColor }}
                    >
                    Reset Password
                    </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button
                      colorScheme="blue"
                      variant="solid"
                      onClick={() => setIsDeleting(true)}
                    >
                    Delete Account
                    </Button>
                </motion.div>
              </HStack>
            </VStack>
        </Flex>

        {/* Account Deletion Modal */}
        <Modal isOpen={isDeleting} onClose={() => setIsDeleting(false)} isCentered>
            <ModalOverlay />
            <ModalContent
              width={{ base: "90%"}}
            >
              <ModalHeader>Confirm Account Deletion</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                  Are you sure you want to delete your account? This action cannot be undone. All your detections and claim checks will also be permanently removed.
              </ModalBody>
              <ModalFooter>
                  <Button colorScheme="red" mr={3} onClick={handleDeleteAccount}>
                  Delete
                  </Button>
                  <Button variant="ghost" onClick={() => setIsDeleting(false)}>
                  Cancel
                  </Button>
              </ModalFooter>
            </ModalContent>
        </Modal>
      </Box>
    </motion.div>
  );
};

export default AccountDetails;
