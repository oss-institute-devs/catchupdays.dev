import { styled } from "@stitches/react";
import { Badge, Card, Container, Grid, Spacer, Text } from "@nextui-org/react";
import React from "react";
import line1 from "@/app/images/line-1.svg";
import line2 from "@/app/images/line-2.svg";
import line3 from "@/app/images/line-3.svg";
import lineMobile from "@/app/images/line-mobile.svg";
import { WithGradient } from "@/app/components/Text";
import { useMediaQuery } from "@/app/components/useMediaQuery";

export const StyledContainer = styled("div", {
  backgroundRepeat: "repeat-y",
  backgroundPosition: "top center",

  "@media only screen and (max-width: 959px)": {
    backgroundImage: `url(${lineMobile.src})`,
  },
});
export const LinesContainer = styled("div", {
  position: "relative",
});
export const Lines = styled("div", {
  position: "absolute",
  display: "none",

  "@media only screen and (min-width: 960px)": {
    display: "block",
  },

  variants: {
    position: {
      a: {
        backgroundImage: `url(${line1.src})`,
        width: "230px",
        height: "101px",
        bottom: "-110px",
        right: 0,
      },
      b: {
        backgroundImage: `url(${line2.src})`,
        width: "327px",
        height: "169px",
        top: "30px",
        left: "80%",
      },
      c: {
        backgroundImage: `url(${line3.src})`,
        width: "228px",
        height: "114px",
        bottom: "-80px",
        right: "105%",
      },
    },
  },
});

export const Hero = () => {
  const isMd = useMediaQuery(960);

  return (
    <StyledContainer>
      <Grid.Container
        gap={isMd ? 0 : 2}
        justify={"space-around"}
        alignItems={"flex-start"}
      >
        <Grid xs={12} sm={4} direction={"column"}>
          <Card variant="bordered">
            <Card.Body>
              <Text h4 css={{ marginBottom: 0 }}>
                <WithGradient>Companies</WithGradient> build better apps,
              </Text>
              <Text css={{ margin: "0" }}>
                keep their <strong>customers happy</strong>, and make the
                employees healthy and <strong>engaged</strong>.
              </Text>
            </Card.Body>
          </Card>
          <LinesContainer>
            <Lines position={"a"} />
          </LinesContainer>
          <Spacer
            y={2}
            css={{
              display: "block",
              "@xs": { display: "block" },
              "@sm": { display: "none" },
            }}
          />
        </Grid>
        <Grid xs={12} sm={4} direction={"column"}>
          <LinesContainer>
            <Lines position={"b"} />
          </LinesContainer>
          <Spacer
            y={4}
            css={{
              display: "none",
              "@xs": { display: "none" },
              "@sm": { display: "block" },
            }}
          />
          <Card variant="bordered">
            <Card.Body>
              <Text h4 css={{ margin: "0" }}>
                <WithGradient>Employees</WithGradient> become better
                professionals,
              </Text>
              <Text css={{ margin: "0" }}>
                understand their <strong>daily tools</strong> better, and build{" "}
                <strong>reputation</strong> with public contributions to
                open-source.
              </Text>
            </Card.Body>
          </Card>
          <Spacer
            y={2}
            css={{
              display: "block",
              "@xs": { display: "block" },
              "@sm": { display: "none" },
            }}
          />
        </Grid>
        <Grid xs={12} sm={4} direction={"column"}>
          <Spacer
            y={10}
            css={{
              display: "none",
              "@xs": { display: "none" },
              "@sm": { display: "block" },
            }}
          />
          <Card variant="bordered">
            <Card.Body>
              <Text h4 css={{ margin: "0" }}>
                <WithGradient>Maintainers</WithGradient> can focus on roadmap,
              </Text>
              <Text css={{ margin: "0" }}>
                get engineers to help <strong>build the project</strong>, build
                better software <strong>faster</strong>, and can get financial
                support.
              </Text>
            </Card.Body>
          </Card>
          <LinesContainer>
            <Lines position={"c"} />
          </LinesContainer>
          <Spacer
            y={2}
            css={{
              display: "block",
              "@xs": { display: "block" },
              "@sm": { display: "none" },
            }}
          />
        </Grid>
      </Grid.Container>
    </StyledContainer>
  );
};
