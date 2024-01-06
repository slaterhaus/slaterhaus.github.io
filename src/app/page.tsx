import { Box, Heading, Link, Text, VStack, Container } from "@chakra-ui/react";
import NextLink from 'next/link';

export default function Home() {
  return (
      <Container maxW="container.md" centerContent>
        <Box textAlign="center" py={10}>
          <Heading as="h1" size="2xl" mb={4} fontFamily="heading">
            Welcome
          </Heading>
          <Text fontSize="xl" mb={6} fontFamily="body">
            Links
          </Text>
          <VStack spacing={4}>
            <NextLink href="/toys" passHref>
              <Link color="accent" _hover={{ textDecoration: 'underline' }}>Toy Collection</Link>
            </NextLink>
            <NextLink href="/music" passHref>
              <Link color="accent" _hover={{ textDecoration: 'underline' }}>Music and Melodies</Link>
            </NextLink>
            <NextLink href="/goals" passHref>
              <Link color="accent" _hover={{ textDecoration: 'underline' }}>Personal Goals</Link>
            </NextLink>
            <NextLink href="/reading-reviews" passHref>
              <Link color="accent" _hover={{ textDecoration: 'underline' }}>Reading, Writing, Reviews</Link>
            </NextLink>
          </VStack>
        </Box>
      </Container>
  );
}
