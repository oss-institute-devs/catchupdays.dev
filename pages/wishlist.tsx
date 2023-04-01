import {
  Container,
  Text,
  Spacer,
  Grid,
  Card,
  Row,
  Loading,
  Tooltip,
  User,
} from "@nextui-org/react";
import Head from "next/head";
import { useQuery } from "react-query";
import { WishlistForm } from "@/app/components/WishlistForm";
import { createStyled } from "@stitches/styled";
import React, { useEffect, useState } from "react";

const { styled } = createStyled({});

const ReactionFullAmount = styled("span", {
  opacity: 1,
  transition: "opacity .2s ease",
  margin: "0 20px 0 0",
  fontWeight: "bold",
});

const ReactionWrapper = styled("span", {
  margin: "0 0 0 -16px",
  background: "#fff",
  borderRadius: "50%",
  width: "26px",
  height: "26px",
  display: "inline-flex",
  textAlign: "center",
  boxShadow: "0 2px 4px rgba(0, 0, 0, .1)",
  transition: "margin .2s ease",
  flex: "1 1",
  justifyContent: "center",
  alignItems: "center",
});

const ReactionHolder = styled("span", {
  [`&:hover ${ReactionWrapper}`]: {
    margin: "0 0 0 2px",
  },
  [`&:hover ${ReactionFullAmount}`]: {
    opacity: 0,
  },
});

const Reaction = ({ num, icon }: { num: number; icon: string }) => {
  if (!num) {
    return null;
  }

  return (
    <ReactionWrapper>
      <Tooltip content={num}>{icon}</Tooltip>
    </ReactionWrapper>
  );
};

export const attributes: Record<
  string,
  {
    title: string;
    key: string;
    items: string[];
    color: string;
  }
> = {
  repos: {
    title: "Repository",
    key: "repo",
    items: ["webpack/webpack", "vercel/next.js"],
    color: "primary",
  },
  libraries: {
    title: "Libraries",
    key: "library",
    items: ["React", "Vue"],
    color: "secondary",
  },
  labels: {
    title: "Labels",
    key: "label",
    items: ["FE", "BE"],
    color: "warning",
  },
  languages: {
    title: "Language",
    key: "language",
    items: ["JavaScript", "TypeScript", "GoLang", "Rust"],
    color: "success",
  },
};

export default function Wishlist() {
  const [focusedAttribute, setFocusedAttribute] = React.useState<string | null>(
    null
  );
  const [activeAttributes, setActiveAttributes] = React.useState(
    new Set<string>([])
  );
  const updateAttributes = (type: string, attrs: typeof activeAttributes) => {
    const currentSet = new Set([...activeAttributes]);

    currentSet.forEach((a) => {
      if (!attrs.has(a) && a.includes(type)) {
        currentSet.delete(a);
      }
    });

    attrs.forEach((a) => {
      if (!currentSet.has(a)) {
        currentSet.add(a);
      }
    });

    setActiveAttributes(currentSet);
  };
  const addAttribute = (attr: string) => {
    const currentSet = new Set([...activeAttributes]);

    currentSet.add(attr);

    setActiveAttributes(currentSet);
  };
  const deleteAttribute = (attr: string) => {
    const currentSet = new Set([...activeAttributes]);

    currentSet.forEach((a) => {
      if (a.includes(attr)) {
        currentSet.delete(a);
      }
    });

    setActiveAttributes(currentSet);
  };

  const { isLoading, isError, error, data } = useQuery(
    ["wishlist", [...activeAttributes].reduce((prev, a) => prev + a, "")],
    async ({ queryKey: [key, attr] }) => {
      const url = new URL(window.location.origin + "/api/wishlist");

      [...activeAttributes].forEach((attr) => {
        const [type, name] = attr.split(":");

        url.searchParams.append(type, name);
      });

      const issues = (await fetch(url)).json();

      return issues;
    },
    {}
  );

  useEffect(() => {
    const url = new URL(window.location.href);
    const attrs = new Set();

    [...url.searchParams].forEach(([type, name]) => {
      attrs.add(`${type}:${name}`);
    });

    setActiveAttributes(attrs);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const url = new URL(window.location.origin + window.location.pathname);

    [...activeAttributes].forEach((attr) => {
      const [type, name] = attr.split(":");

      url.searchParams.append(type, name);
    });

    window.history.replaceState(null, "", url);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeAttributes]);

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  return (
    <main>
      <Head>
        <title>The Wishlist | Catchup Days</title>
        <meta
          property="og:title"
          content="Wishlist | Catchup Days"
          key="title"
        />
      </Head>
      <Container xs>
        <Spacer y={4} />
        <Text
          h1
          weight="black"
          css={{
            textAlign: "center",
            lineHeight: 1.2,
          }}
        >
          The Wishlist
        </Text>
        <Text
          color={"$gray800"}
          size={20}
          css={{
            textAlign: "center",
            lineHeight: 1.4,
          }}
        >
          Here's where you can explore and find the issues that best suit you.
        </Text>
        <Text
          color={"$gray800"}
          size={20}
          css={{
            textAlign: "center",
            lineHeight: 1.4,
          }}
        >
          You can go for most popular (so most burning) tasks, small and easy to
          start with, or any that fits your mood right now.
        </Text>
        <Spacer y={2} />
      </Container>
      <Container sm>
        <WishlistForm
          attributes={attributes}
          focusedAttribute={focusedAttribute}
          addAttribute={addAttribute}
          deleteAttribute={deleteAttribute}
          updateAttributes={updateAttributes}
          setFocusedAttribute={setFocusedAttribute}
          activeAttributes={activeAttributes}
        />
      </Container>
      <Container sm>
        {!isLoading ? (
          <Grid.Container gap={1} justify="center">
            {data.map((task) => {
              const repo = task.repository_url.split("/").slice(-2).join("/");

              return (
                <Grid key={task.id} xs={12}>
                  <Card
                    isPressable
                    isHoverable
                    variant="bordered"
                    as={"a"}
                    href={task.html_url}
                    data-blobity-offset-x={0}
                    data-blobity-offset-y={0}
                  >
                    <Card.Body css={{ padding: "8px 10px" }}>
                      <Row justify={"space-between"}>
                        <Grid.Container>
                          <Row justify={"flex-start"}>
                            <Text h4>{task.title}</Text>
                          </Row>
                          <Row justify={"flex-start"}>
                            <User
                              src={task.user.avatar_url}
                              name={task.user.login}
                              size={"xs"}
                            />
                          </Row>
                        </Grid.Container>
                        <Grid.Container>
                          <Row justify={"flex-end"}>
                            <Spacer y={1}></Spacer>
                            {task.reactions.total_count ? (
                              <Row justify={"flex-end"}>
                                <ReactionHolder>
                                  <ReactionFullAmount>
                                    {task.reactions.total_count}
                                  </ReactionFullAmount>
                                  <Reaction
                                    num={task.reactions.laugh}
                                    icon="😄"
                                  />
                                  <Reaction
                                    num={task.reactions.hooray}
                                    icon="🎉"
                                  />
                                  <Reaction
                                    num={task.reactions.confused}
                                    icon="😕"
                                  />
                                  <Reaction
                                    num={task.reactions.heart}
                                    icon="❤️"
                                  />
                                  <Reaction
                                    num={task.reactions.eyes}
                                    icon="👀"
                                  />
                                  <Reaction
                                    num={task.reactions.rocket}
                                    icon="🚀"
                                  />
                                </ReactionHolder>
                              </Row>
                            ) : null}
                          </Row>

                          <Row justify={"flex-end"}>
                            <Text color={"$gray800"}>{repo}</Text>
                          </Row>
                          <Row justify={"flex-end"}>
                            <Text color={"$gray800"}>
                              {new Intl.DateTimeFormat("en-GB", {
                                dateStyle: "full",
                              }).format(new Date(task.created_at))}
                            </Text>
                          </Row>
                        </Grid.Container>
                      </Row>
                    </Card.Body>
                  </Card>
                </Grid>
              );
            })}
          </Grid.Container>
        ) : (
          <Row justify={"center"}>
            <Loading />
          </Row>
        )}
      </Container>
    </main>
  );
}
