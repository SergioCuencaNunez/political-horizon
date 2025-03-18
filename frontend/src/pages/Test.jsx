<Grid templateColumns={{ base: "repeat(1, 1fr)", lg: "repeat(2, 1fr)" }} gap="4" mb="5">
  {filteredArticles.map((article, index) => (
    <motion.div
      key={article.id}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.025 }}
      whileTap={{ scale: 0.95 }}
      transition={{
        opacity: { duration: 0.5, delay: 0.1 * index },
        scale: { type: "spring", stiffness: 300, damping: 20 },
      }}
    >
      <Box position="relative" height="200px" perspective="1000px">
        <motion.div
          style={{ width: "100%", height: "100%", transformStyle: "preserve-3d" }}
          animate={{ rotateY: flippedCards[article.id] ? 180 : 0 }}
          transition={{ duration: 0.6 }}
        >
          <Flex
            p="5"
            borderRadius="md"
            shadow="md"
            direction="column"
            justify="center"
            height="100%"
            bg={modelCardBg}
            position="absolute"
            width="100%"
            backfaceVisibility="hidden"
          >
            <Text fontWeight="bold" fontSize="lg" mb="1" textAlign="justify">
              {article.headline}
            </Text>
            <Text fontSize="sm" color="gray.500" mb="2">
              {article.outlet} - {new Date(article.date_publish).toLocaleDateString()}
            </Text>
            <Badge
              colorScheme={
                article.political_leaning === "RIGHT"
                  ? "red"
                  : article.political_leaning === "LEFT"
                  ? "blue"
                  : "yellow"
              }
              width="fit-content"
              mb="4"
            >
              {article.political_leaning}
            </Badge>
            <HStack spacing="2" justify="space-between" width="100%">
              <HStack spacing="2">
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <IconButton
                    icon={<FaThumbsUp />}
                    onClick={() => handleInteraction(article.id, "like")}
                  />
                </motion.div>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <IconButton
                    icon={<FaThumbsDown />}
                    onClick={() => handleInteraction(article.id, "dislike")}
                  />
                </motion.div>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button
                    leftIcon={<ExternalLinkIcon />}
                    onClick={() => handleReadMore(article.id, article.url)}
                  >
                    Read More
                  </Button>
                </motion.div>
              </HStack>
              {userStatus === "returning" && article.source_article_headline && (
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <IconButton
                    icon={<InfoOutlineIcon />}
                    onClick={() => handleFlip(article.id)}
                  />
                </motion.div>
              )}
            </HStack>
          </Flex>
          <Flex
            p="5"
            borderRadius="md"
            shadow="md"
            direction="column"
            justify="center"
            height="100%"
            bg={modelCardBg}
            position="absolute"
            width="100%"
            transform="rotateY(180deg)"
            backfaceVisibility="hidden"
          >
            <Text fontWeight="bold" fontSize="lg">Why This Article?</Text>
            <Text fontSize="sm" color="gray.500">
              This article was recommended based on your interest in:
            </Text>
            <Text fontSize="md" fontWeight="bold">"{article.source_article_headline}"</Text>
            <IconButton
              icon={<RepeatIcon />}
              onClick={() => handleFlip(article.id)}
              mt={4}
              alignSelf="center"
            />
          </Flex>
        </motion.div>
      </Box>
    </motion.div>
  ))}
</Grid>;