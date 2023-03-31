import React, {
  ChangeEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Grid,
  Row,
  Spacer,
  Dropdown,
  Badge,
  Card,
  Text,
} from "@nextui-org/react";

const Input = ({
  value,
  deleteFocused,
  isAttributeFocused,
  focusNext,
  focusPrevious,
  defocus,
  autocompleteItems,
  selectAttribute,
  selectedAttributes,
}: {
  value: JSX.Element[];
  deleteFocused: () => void;
  isAttributeFocused: boolean;
  focusNext: () => void;
  focusPrevious: () => void;
  defocus: () => void;
  autocompleteItems: string[];
  selectAttribute: (attr: string) => void;
  selectedAttributes: string[];
}) => {
  const autocompleteRef = useRef<HTMLUListElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [text, setText] = useState("");
  const [width, setWidth] = useState(0);
  const [openAutocomplete, setOpenAutocomplete] = useState(false);
  const focusInput = () => {
    inputRef.current?.focus();
  };
  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (text === "") {
      if (event.key === "Backspace" && value.length) {
        if (isAttributeFocused) {
          deleteFocused();
        } else {
          focusPrevious();
        }
      }

      if (event.key === "ArrowLeft") {
        focusPrevious();
      }
      if (event.key === "ArrowRight") {
        focusNext();
      }
    }
    if (event.key === "Escape") {
      defocus();
      setOpenAutocomplete(false);
    }
    if (event.key === "Enter") {
      setOpenAutocomplete(false);
    }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      autocompleteRef.current?.focus();
    }
  };
  const onKeyUp = (event: KeyboardEvent<HTMLInputElement>) => {
    setText(event.target.value);
    setOpenAutocomplete(true);

    if (event.key === "Escape") {
      defocus();
      setOpenAutocomplete(false);
    }
  };
  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
    setOpenAutocomplete(true);
  };

  const autocomplete = autocompleteItems
    .filter((a) =>
      text
        .toLocaleLowerCase()
        .split(" ")
        .reduce(
          (condition, word) =>
            condition && a.toLocaleLowerCase().includes(word),
          true
        )
    )
    .filter((a) => !selectedAttributes.includes(a));

  useEffect(() => {
    setWidth(inputRef.current.scrollWidth);
  }, [text]);

  return (
    <>
      <Card variant="bordered" xs>
        <Card.Body xs onClick={focusInput} css={{ cursor: "text" }}>
          <div
            style={{
              display: "block",
              margin: "-4px 0 -12px 0",
              minHeight: "38px",
            }}
          >
            <Text>
              {value}
              <input
                value={text}
                onChange={onChange}
                onKeyUp={onKeyUp}
                onKeyDown={onKeyDown}
                ref={inputRef}
                type="text"
                autoFocus
                placeholder={!value?.length ? "Type your filter here..." : ""}
                style={{
                  width: value?.length ? `${width}px` : "200px",
                  border: "none",
                  background: "transparent",
                }}
              />
            </Text>
          </div>
        </Card.Body>
      </Card>
      {openAutocomplete && text.length >= 2 ? (
        <Dropdown isOpen={true} placement="bottom-left" closeOnSelect={true}>
          <Dropdown.Trigger
            css={{ position: "absolute", bottom: 0, left: 0, zIndex: -1 }}
          >
            .
          </Dropdown.Trigger>
          <Dropdown.Menu
            aria-label="Autocomplete"
            selectionMode="none"
            onAction={(a) => {
              setOpenAutocomplete(false);
              selectAttribute(a);
              setText("");
            }}
            onClose={() => {
              setOpenAutocomplete(false);
            }}
            ref={autocompleteRef}
            disabledKeys={["more"]}
            shouldFocusWrap={false}
          >
            {autocomplete.slice(0, 5).map((item, index) => {
              const [type, name] = item.split(":");
              return (
                <Dropdown.Item key={item} description={type}>
                  {name}
                </Dropdown.Item>
              );
            })}
            {autocomplete.length >= 5 ? (
              <Dropdown.Item key={"more"} variant="flat">
                and more...
              </Dropdown.Item>
            ) : null}
          </Dropdown.Menu>
        </Dropdown>
      ) : null}
    </>
  );
};
const Label = ({
  text,
  color = "neutral",
  removeItem,
  isActive = false,
}: {
  text: string;
  color: string;
  removeItem: () => void;
  isActive?: boolean;
}) => {
  return (
    <span
      style={{
        display: "inline-block",
        margin: "0 8px 8px 0",
      }}
    >
      <Badge
        color="neutral"
        variant="flat"
        content="&times;"
        enableShadow
        disableOutline
        size="sm"
        css={{
          cursor: "pointer",
          background: "$gray800",
          color: "#fff",
          textAlign: "center",
          lineHeight: "11px",
          display: "inline-block",
          padding: "0 1px 0 0",
        }}
        onClick={removeItem}
      >
        <Badge enableShadow={isActive} disableOutline variant="flat" isSquared>
          {text}
        </Badge>
      </Badge>
    </span>
  );
};

const attributes = {
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

export const WishlistForm = () => {
  const [inputText, setInputText] = useState([]);

  const [focusedAttribute, setFocusedAttribute] = React.useState<string | null>(
    null
  );
  const [activeAttributes, setActiveAttributes] = React.useState(new Set([]));
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

  useEffect(() => {
    const attributesString = Array.from(activeAttributes).map((attribute) => {
      const [typeOfKey, name] = attribute.split(":");
      const type = Object.values(attributes).find((a) => a.key === typeOfKey);

      return (
        <Label
          key={attribute}
          text={`${typeOfKey}: ${name}`}
          color={type.color}
          isActive={focusedAttribute === attribute}
          removeItem={() => deleteAttribute(attribute)}
        />
      );
    });

    setInputText(attributesString);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeAttributes, focusedAttribute]);

  return (
    <Grid>
      <Row justify={"space-around"}>
        <Input
          autocompleteItems={Object.values(attributes).flatMap(
            (attributeGroup) =>
              attributeGroup.items.map((item) => {
                return `${attributeGroup.key}:${item}`;
              })
          )}
          isAttributeFocused={!!focusedAttribute}
          value={inputText}
          deleteFocused={() => {
            if (focusedAttribute) {
              deleteAttribute(focusedAttribute);
              setFocusedAttribute(null);
            }
          }}
          focusPrevious={() => {
            if (focusedAttribute) {
              const arrayOfAttributes = Array.from(activeAttributes);
              const focusedIndex = arrayOfAttributes.indexOf(focusedAttribute);
              setFocusedAttribute(arrayOfAttributes[focusedIndex - 1]);
            } else {
              setFocusedAttribute(Array.from(activeAttributes).pop());
            }
          }}
          focusNext={() => {
            const arrayOfAttributes = Array.from(activeAttributes);
            const focusedIndex = arrayOfAttributes.indexOf(focusedAttribute);
            setFocusedAttribute(arrayOfAttributes[focusedIndex + 1]);
          }}
          defocus={() => {
            setFocusedAttribute(null);
          }}
          selectAttribute={addAttribute}
          selectedAttributes={[...activeAttributes]}
        />
      </Row>
      <Spacer y={1} />
      <Row justify={"flex-start"}>
        <Grid.Container gap={1} justify="start">
          {Object.entries(attributes).map(([key, value]) => {
            const activeOfType = value.items
              .filter((i) =>
                [...activeAttributes].includes(`${value.key}:${i}`)
              )
              .map((i) => `${value.key}:${i}`);

            return (
              <Grid key={key}>
                <Dropdown placement="bottom-left">
                  {activeOfType.length ? (
                    <Badge
                      color="neutral"
                      variant="flat"
                      content={activeOfType.length || null}
                      enableShadow
                      disableOutline
                      size="sm"
                      css={{
                        cursor: "pointer",
                        background: "$red800",
                        color: "#fff",
                      }}
                    >
                      <Dropdown.Button flat color="neutral">
                        {value.title}
                      </Dropdown.Button>
                    </Badge>
                  ) : (
                    <Dropdown.Button flat color="neutral">
                      {value.title}
                    </Dropdown.Button>
                  )}
                  <Dropdown.Menu
                    aria-label="Repo"
                    color="primary"
                    selectionMode="multiple"
                    selectedKeys={activeOfType}
                    onSelectionChange={(attrs) =>
                      updateAttributes(value.key, attrs)
                    }
                  >
                    {value.items.map((attr) => (
                      <Dropdown.Item key={`${value.key}:${attr}`}>
                        {attr}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </Grid>
            );
          })}
        </Grid.Container>
      </Row>
      <Spacer y={1} />
    </Grid>
  );
};
